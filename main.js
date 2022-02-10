import http from "http"
import fetch from "node-fetch"

const clientId = process.env["CLIENT_ID"]
const apiKey = process.env["API_KEY"]
const port = process.env["PORT"] || 8089
const authorization = Buffer.from(`${clientId}:${apiKey}`).toString("base64")

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

  const url = `https://int-api.mx.com/users/${userGuid}/widget_urls`
  const options = {
    method: "POST",
    headers: {
      Accept: "application/vnd.mx.api.v1+json",
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      widget_url: {
        widget_type: widgetType,
        is_mobile_webview: true,
        ui_message_version: 4,
        ui_message_webview_url_scheme: "mx",
      },
    }),
  }

  let responseJson
  try {
    const apiRes = await fetch(url, options)
    responseJson = await apiRes.json()
  } catch (error) {
    console.log(`Error making API request: ${error}`)
    res.writeHead(500)
    res.end("Error making API request")
  }

  res.writeHead(200)
  res.end(JSON.stringify(responseJson))
  console.log("done")
}

const server = http.createServer(requestListener)
console.log(`Listening on port ${port}`)
server.listen(port)
