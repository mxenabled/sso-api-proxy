import { config } from "dotenv"
import { writeFileSync } from "fs"

import { yesNo, prompt } from "./cli.js"

export const loadConfig = () => {
  config()

  return {
    clientId: process.env["CLIENT_ID"],
    apiKey: process.env["API_KEY"],
  }
}

export const createDotEnv = async () => {
  const create = await yesNo("Would you like me to help you create a .env file? [y/N]")
  if (!create) {
    return false
  }

  const clientId = await prompt("Enter your client's ID:", true)
  const apiKey = await prompt("Enter your client's API key:", true)
  writeFileSync(".env", `CLIENT_ID=${clientId}\nAPI_KEY=${apiKey}`)

  return true
}
