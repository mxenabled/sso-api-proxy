import express from "express"
import morgan from "morgan"
import "express-async-errors"
import { MxPlatformApi, Configuration } from "mx-platform-node"

import { loadConfiguration } from "./configuration"

export async function run(port: number) {
  const config = await loadConfiguration()
  const client = new MxPlatformApi(
    new Configuration({
      username: config.clientId,
      password: config.apiKey,
      basePath: config.apiHost,
      baseOptions: {
        headers: {
          Accept: "application/vnd.mx.api.v1+json",
        },
      },
    }),
  )

  const app = makeApplication(client)
  app.listen(port, () => {
    console.log(`Running server on port ${port}`)
  })
}

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

    const body = {
      widget_url: {
        widget_type: req.query.widget_type,
        ...req.query,
      },
    }
    const language = req.headers["accept-language"]?.toString()
    const response = await client.requestWidgetURL(req.params.userGuid, body, language)

    res.json(response.data)
  })

  app.post("/users/:userGuid/widget_urls", async (req, res) => {
    const body = req.body
    const language = req.headers["accept-language"]?.toString()
    const response = await client.requestWidgetURL(req.params.userGuid, body, language)

    res.json(response.data)
  })

  return app
}
