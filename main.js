import http from "http"
import fetch from "node-fetch"

import { printWelcome, printApiDocs } from "./help.js"
import { loadConfig, createDotEnv } from "./config.js"

let { clientId, apiKey } = loadConfig()
const port = process.env["PORT"] || 8089

const requestListener = async (req, res) => {
  process.stdout.write(`Handling ${req.url} `)

  const parts = req.url.split("/")
  if (parts.length < 3) {
    res.writeHead(400)
    res.end("Missing widget type and user guid data in url")
    return
  }

  const widgetType = parts[1]
  const userGuid = parts[2]

  const bodyParts = []
  for await (const chunk of req) {
    bodyParts.push(chunk)
  }
  const bodyData = Buffer.concat(bodyParts).toString()
  const body = bodyData ? JSON.parse(bodyData) : {}

  const authorization = Buffer.from(`${clientId}:${apiKey}`).toString("base64")
  const url = `https://int-api.mx.com/users/${userGuid}/widget_urls`
  const options = {
    method: "POST",
    headers: {
      Accept: "application/vnd.mx.api.v1+json",
      Authorization: `Basic ${authorization}`,
      "Accept-Language": req.headers["accept-language"],
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      widget_url: {
        widget_type: widgetType,
        is_mobile_webview: true,
        ui_message_version: 4,
        ui_message_webview_url_scheme: "mx",
        ...body?.widget_url,
      },
    }),
  }

  let responseJson
  try {
    const apiRes = await fetch(url, options)
    console.log(apiRes)
    responseJson = await apiRes.json()
  } catch (error) {
    console.log(`Error making API request: ${error}`)
    res.writeHead(500)
    res.end("Error making API request")
    return
  }

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")
  res.writeHead(200)
  res.end(JSON.stringify(responseJson))

  console.log("done")
}

if (!clientId || !apiKey) {
  console.log(`
Error: I need a CLIENT_ID and an API_KEY environment variable before I can run.
You can defined those variables in your environment or in a .env file.`)

  const created = await createDotEnv()

  if (!created) {
    console.log("Ok, goodbye")
    process.exit(1)
  }

  clientId = loadConfig().clientId
  apiKey = loadConfig().apiKey
}

printWelcome()

process.stdout.write("Starting server... ")
const server = http.createServer(requestListener)
server.listen(port)
process.stdout.write(` ready, listening on port ${port}\n`)

printApiDocs(port)
