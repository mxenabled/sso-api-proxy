#!/usr/bin/env node

import { Command } from "commander"
import wrapText from "wrap-text"

import { run } from "./application"
import { name } from "./configuration"
import { description, version } from "./package-info"

const program = new Command()

program.name(name).description(wrapText(description)).version(version)

program
  .command("run", { isDefault: true })
  .description("Run the MX SSO API proxy server")
  .option("-p, --port <number>", "port number", process.env.PORT || "8089")
  .action((options: { port: number }) => run(options.port))

program.parse()
