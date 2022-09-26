import "dotenv/config"

import inquirer from "inquirer"
import debug from "debug"
import { cosmiconfig } from "cosmiconfig"

const name = "mx-sso-proxy"
const log = debug(`${name}:configuration`)
const explorer = cosmiconfig(name, {
  searchPlaces: [
    `.${name}-rc`,
    `.${name}-rc.json`,
    `.${name}-rc.yaml`,
    `.${name}-rc.yml`,
    `.${name}-rc.js`,
    `.${name}-rc.cjs`,
    `${name}.config.js`,
    `${name}.config.cjs`,
  ],
})

export async function loadConfiguration() {
  return explorer.search().then((result) => {
    const clientId = process.env.MX_CLIENT_ID || result?.config?.clientId
    const apiKey = process.env.MX_API_KEY || result?.config?.apiKey
    const apiHost = process.env.MX_API_HOST || result?.config?.apiHost

    if (result?.filepath) {
      log(`configuration file: ${result.filepath}`)
    } else {
      log("configuration file not found")
    }

    log(`clientDd found: ${!!clientId}`)
    log(`apiKey found: ${!!apiKey}`)
    log(`apiHost: ${apiHost}`)

    if (!clientId || !apiKey || !apiHost) {
      return runConfigurationWizard(clientId, apiKey, apiHost)
    }

    return { clientId, apiKey, apiHost }
  })
}

enum Environment {
  Development = "Development",
  Production = "Production",
}

const Hosts = {
  [Environment.Development]: "https://int-api.mx.com",
  [Environment.Production]: "https://api.mx.com",
}

function environmentHost(environmentMaybe: string) {
  if (environmentMaybe in Hosts) {
    return Hosts[environmentMaybe as Environment]
  }

  throw new Error("...")
}

async function runConfigurationWizard(
  existingClientId?: string,
  existingApiKey?: string,
  existingApiHost?: string,
) {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "clientId",
        message: "Client ID",
        when: !existingClientId,
        validate: (answer) => !!answer,
      },
      {
        type: "input",
        name: "apiKey",
        message: "API key",
        when: !existingApiKey,
        validate: (answer) => !!answer,
      },
      {
        type: "list",
        name: "environment",
        message: "Environment",
        when: !existingApiHost,
        choices: [Environment.Development, Environment.Production],
        validate: (answer) => !!answer,
      },
    ])
    .then((answers) => {
      return {
        clientId: existingClientId || answers.clientId,
        apiKey: existingApiKey || answers.apiKey,
        apiHost: existingApiHost || environmentHost(answers.environment),
      }
    })
}
