import inquirer from "inquirer"

export async function loadConfiguration() {
  const clientId = process.env.MX_CLIENT_ID
  const apiKey = process.env.MX_API_KEY
  const apiHost = process.env.MX_API_HOST

  if (!clientId || !apiKey || !apiHost) {
    return await runConfigurationWizard(clientId, apiKey, apiHost)
  }

  return { clientId, apiKey, apiHost }
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
