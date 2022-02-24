import { readFileSync } from "fs"

const { version } = JSON.parse(readFileSync("./package.json"))

const header = `
 /$$      /$$ /$$       /$$                       /$$            /$$$$$$   /$$$$$$   /$$$$$$
| $$  /$ | $$|__/      | $$                      | $$           /$$__  $$ /$$__  $$ /$$__  $$
| $$ /$$$| $$ /$$  /$$$$$$$  /$$$$$$   /$$$$$$  /$$$$$$        | $$  \\__/| $$  \\__/| $$  \\ $$
| $$/$$ $$ $$| $$ /$$__  $$ /$$__  $$ /$$__  $$|_  $$_/        |  $$$$$$ |  $$$$$$ | $$  | $$
| $$$$_  $$$$| $$| $$  | $$| $$  \\ $$| $$$$$$$$  | $$           \\____  $$ \\____  $$| $$  | $$
| $$$/ \\  $$$| $$| $$  | $$| $$  | $$| $$_____/  | $$ /$$       /$$  \\ $$ /$$  \\ $$| $$  | $$
| $$/   \\  $$| $$|  $$$$$$$|  $$$$$$$|  $$$$$$$  |  $$$$/      |  $$$$$$/|  $$$$$$/|  $$$$$$/
|__/     \\__/|__/ \\_______/ \\____  $$ \\_______/   \\___/         \\______/  \\______/  \\______/
                            /$$  \\ $$
                           |  $$$$$$/
                            \\______/

       /$$$$$$  /$$$$$$$  /$$$$$$       /$$$$$$$
      /$$__  $$| $$__  $$|_  $$_/      | $$__  $$
     | $$  \\ $$| $$  \\ $$  | $$        | $$  \\ $$ /$$$$$$   /$$$$$$  /$$   /$$ /$$   /$$
     | $$$$$$$$| $$$$$$$/  | $$        | $$$$$$$//$$__  $$ /$$__  $$|  $$ /$$/| $$  | $$
     | $$__  $$| $$____/   | $$        | $$____/| $$  \\__/| $$  \\ $$ \\  $$$$/ | $$  | $$
     | $$  | $$| $$        | $$        | $$     | $$      | $$  | $$  >$$  $$ | $$  | $$
     | $$  | $$| $$       /$$$$$$      | $$     | $$      |  $$$$$$/ /$$/\\  $$|  $$$$$$$
     |__/  |__/|__/      |______/      |__/     |__/       \\______/ |__/  \\__/ \\____  $$
                                                                               /$$  | $$
                                                                              |  $$$$$$/
                                                                               \\______/

                                                                                (v${version})
`

export const printWelcome = () =>
  console.log(header)

export const printApiDocs = (port) => {
  console.log(`
This server proxies request to our Platform API for Widget SSO URLs. Any
configuration that you could normally pass to the Platform API via the request
body or a header can be passed in this server as well. This server expects
request URLs with the following form:

    http://localhost:${port}/<widget>/<user_guid>.


Example curl commands:

    curl localhost:8089/connect_widget/USR-081ff65e-3087-4cc2-a2c4-365354e1e6cb


If you're using the example Widget SDK application, add this to your
config.json file (just replace <user guid> with your user's guid):

    {
        "proxy": "http://localhost:8089/connect_widget/<user guid>"
    }
`)
}
