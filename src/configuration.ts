import "dotenv/config"

import inquirer from "inquirer"
import debug from "debug"
import { cosmiconfig } from "cosmiconfig"

export interface Configuration {
  clientId: string
  apiKey: string
  apiHost: string
  defaultUserGuid?: string
}

export const name = "mx-sso-api-proxy"
const log = debug(`${name}:configuration`)
const explorer = cosmiconfig(name, {
  searchPlaces: [
    `${name}-rc.cjs`,
    `${name}-rc.js`,
    `${name}-rc.json`,
    `${name}-rc.yaml`,
    `${name}-rc.yml`,
    `${name}-rc`,
    `${name}.config.cjs`,
    `${name}.config.js`,
    `.${name}-rc.cjs`,
    `.${name}-rc.js`,
    `.${name}-rc.json`,
    `.${name}-rc.yaml`,
    `.${name}-rc.yml`,
    `.${name}-rc`,
    `.${name}.config.cjs`,
    `.${name}.config.js`,
  ],
})

export async function loadConfiguration(): Promise<Configuration> {
  return explorer.search().then((result) => {
    const clientId = process.env.MX_CLIENT_ID || result?.config?.clientId
    const apiKey = process.env.MX_API_KEY || result?.config?.apiKey
    const apiHost = process.env.MX_API_HOST || result?.config?.apiHost
    const defaultUserGuid = process.env.MX_DEFAULT_USER_GUID || result?.config?.defaultUserGuid

    if (result?.filepath) {
      log(`configuration file: ${result.filepath}`)
    } else {
      log("configuration file not found")
    }

    log(`clientId found: ${!!clientId}`)
    log(`apiKey found: ${!!apiKey}`)
    log(`apiHost: ${apiHost}`)
    log(`defaultUserGuid: ${defaultUserGuid}`)

    if (!clientId || !apiKey || !apiHost) {
      return runConfigurationWizard(clientId, apiKey, apiHost, defaultUserGuid)
    }

    return { clientId, apiKey, apiHost, defaultUserGuid }
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
  existingDefaultUserGuid?: string,
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
        type: "input",
        name: "defaultUserGuid",
        message: "Default user guid",
        when: !existingDefaultUserGuid,
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
        defaultUserGuid: existingDefaultUserGuid || answers.defaultUserGuid,
      }
    })
}
