import express from "express"
import "express-async-errors"
import type { Request, Response } from "express"

import morgan from "morgan"
import { MxPlatformApi, Configuration as MxPlatformApiConfiguration } from "mx-platform-node"
import type { WidgetRequestBody } from "mx-platform-node"

import { Configuration, loadConfiguration } from "./configuration"

export async function run(port: number) {
  const config = await loadConfiguration()
  const client = new MxPlatformApi(
    new MxPlatformApiConfiguration({
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

  const app = makeApplication(client, config)
  app.listen(port, () => {
    console.log(`Running server on port ${port}`)
  })
}

export function makeApplication(client: MxPlatformApi, config: Configuration) {
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

    respondWithSSOURL(req, res, client, req.params.userGuid, body)
  })

  app.post("/users/:userGuid/widget_urls", async (req, res) => {
    respondWithSSOURL(req, res, client, req.params.userGuid, req.body)
  })

  app.options("/user/widget_urls", (req, res) => {
    res.sendStatus(200)
  })

  app.get("/user/widget_urls", async (req, res) => {
    if (typeof config.defaultUserGuid !== "string") {
      res.status(422).json({ error: "Missing defaultUserGuid in configuration" })
      return
    }

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

    respondWithSSOURL(req, res, client, config.defaultUserGuid, body)
  })

  app.post("/user/widget_urls", async (req, res) => {
    if (typeof config.defaultUserGuid !== "string") {
      res.status(422).json({ error: "Missing defaultUserGuid in configuration" })
      return
    }

    respondWithSSOURL(req, res, client, config.defaultUserGuid, req.body)
  })

  return app
}

async function respondWithSSOURL(
  req: Request,
  res: Response,
  client: MxPlatformApi,
  userGuid: string,
  body: WidgetRequestBody,
) {
  const response = await client.requestWidgetURL(
    userGuid,
    body,
    req.headers["accept-language"]?.toString(),
  )
  res.json(response.data)
}
