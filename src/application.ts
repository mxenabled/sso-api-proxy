import express from "express"
import morgan from "morgan"
import "express-async-errors"
import { MxPlatformApi } from "mx-platform-node"

export function makeApplication(client: MxPlatformApi) {
  const app = express()

  app.use(morgan("tiny"))
  app.use(express.json())

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    next()
  })

  app.head("/", (req, res) => {
    res.sendStatus(200)
  })

  app.options("/users/:userGuid/widget_urls", (req, res) => {
    res.sendStatus(200)
  })

  app.get("/users/:userGuid/widget_urls", async (req, res) => {
    if (typeof req.query.widget_type !== "string") {
      res.status(422).json({ error: "Missing widget_type query parameter" })
      return
    }

    const response = await client.requestWidgetURL(req.params.userGuid, {
      widget_url: {
        widget_type: req.query.widget_type,
        ...req.query,
      },
    })

    res.json(response.data)
  })

  app.post("/users/:userGuid/widget_urls", async (req, res) => {
    const response = await client.requestWidgetURL(req.params.userGuid, req.body)
    res.json(response.data)
  })

  return app
}
