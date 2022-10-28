import https from "https"

import express from "express"
import "express-async-errors"
import type { Request, Response, ErrorRequestHandler, NextFunction } from "express"

import morgan from "morgan"
import open from "open"
import { MxPlatformApi, Configuration as MxPlatformApiConfiguration } from "mx-platform-node"
import type { WidgetRequestBody } from "mx-platform-node"

import { Configuration, loadConfiguration } from "./configuration"

export async function run(port: number, serveLocalFiles?: boolean, openPath?: string) {
  const config = await loadConfiguration()
  const rejectUnauthorized = !config.apiHost.match(/\b(qa|sand)\b/)
  const client = new MxPlatformApi(
    new MxPlatformApiConfiguration({
      username: config.clientId,
      password: config.apiKey,
      basePath: config.apiHost,
      baseOptions: {
        headers: {
          Accept: "application/vnd.mx.api.v1+json",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized,
        }),
      },
    }),
  )

  const app = makeApplication(client, config, serveLocalFiles || false)
  app.listen(port, () => {
    console.log(`Running server on port ${port}`)

    if (openPath) {
      open(`http://localhost:${port}/${openPath}`)
    }
  })
}

export function makeApplication(
  client: MxPlatformApi,
  config: Configuration,
  serveLocalFiles: boolean,
) {
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

  app.get("/users/:userGuid/widget_urls", async (req, res, next) => {
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

    respondWithSsoUrl(req, res, client, req.params.userGuid, body, next)
  })

  app.post("/users/:userGuid/widget_urls", async (req, res, next) => {
    respondWithSsoUrl(req, res, client, req.params.userGuid, req.body, next)
  })

  app.options("/user/widget_urls", (req, res) => {
    res.sendStatus(200)
  })

  app.get("/user/widget_urls", async (req, res, next) => {
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

    respondWithSsoUrl(req, res, client, config.defaultUserGuid, body, next)
  })

  app.post("/user/widget_urls", async (req, res, next) => {
    if (typeof config.defaultUserGuid !== "string") {
      res.status(422).json({ error: "Missing defaultUserGuid in configuration" })
      return
    }

    respondWithSsoUrl(req, res, client, config.defaultUserGuid, req.body, next)
  })

  const errHandler: ErrorRequestHandler = (err, req, res, _next) => {
    console.error(err.stack)
    res.status(500).send(err.message)
  }

  if (serveLocalFiles) {
    console.log("Service local files")
    app.use(express.static("."))
  }

  app.use(errHandler)

  return app
}

async function respondWithSsoUrl(
  req: Request,
  res: Response,
  client: MxPlatformApi,
  userGuid: string,
  body: WidgetRequestBody,
  next: NextFunction,
) {
  try {
    const response = await client.requestWidgetURL(
      userGuid,
      body,
      req.headers["accept-language"]?.toString(),
    )
    res.json(response.data)
  } catch (err) {
    next(err)
  }
}
