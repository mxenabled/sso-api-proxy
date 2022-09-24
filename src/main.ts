import "dotenv/config"

import { promises as fs } from "fs"
import { MxPlatformApi, Configuration } from "mx-platform-node"

import { makeApplication } from "./application"
import { loadConfiguration } from "./configuration"

async function main() {
  const pkg = await fs.readFile("./package.json")
  const { name, version } = JSON.parse(pkg.toString())

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
  const port = process.env.PORT || 8089

  console.log(`Starting ${name} v${version}`)
  app.listen(port, () => {
    console.log(`Running server on port ${port}`)
  })
}

main()
