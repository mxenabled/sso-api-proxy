#!/usr/bin/env node

import { readFileSync } from "fs"
const { Command } = require("commander")

import { run } from "./application"
import { name } from "./configuration"

const program = new Command()
const pkg = readFileSync("./package.json")
const { description, version } = JSON.parse(pkg.toString())

program.name(name).description(description).version(version)

program
  .command("run", { isDefault: true })
  .description("Run the MX SSO API proxy server")
  .option("-p, --port <number>", "port number", process.env.PORT || 8089)
  .action((options: { port: number }) => run(options.port))

program.parse()
