# SSO API Proxy

This is a proxy server used to get Widget SSO URLs from our Platform API. Any
configuration that you could normally pass to the Platform API via the request
body or a header can be passed in this server as well.

## Getting started

Run `npm i -g @mxenabled/sso-api-proxy` to install this package globally and be
able to run the `mx-sso-api-proxy` command from anywhere. Running
`mx-sso-api-proxy` will start the proxy server. Run `mx-sso-api-proxy help` for
additional information on the commands and arguments.

## Configuration

When the server starts, the following environment variables will be used if found:

- `MX_CLIENT_ID`
- `MX_API_KEY`
- `MX_API_HOST`
- `MX_DEFAULT_USER_GUID`

Alternatively, a configuration file named `.mx-sso-api-proxy-rc.yaml` will be
searched for, and, if located, used as well. The configuration file should look
like this:

```yaml
apiKey: "[api key]"
apiHost: "https://int-api.mx.com"
clientId: "[client id]"
defaultUserGuid: "[default user guid]"
```

If a required configuration is missing, you will be prompted to enter it in
before the server starts.

## Making requests

The server has the following endpoints:

- `GET /user/widget_urls`
- `POST /user/widget_urls`
- `GET /users/{user_guid}/widget_urls`
- `POST /users/{user_guid}/widget_urls`


The `/users/{user_guid}/widget_urls` endpoints use the user guid provided in
the URL, whereas the `/user/widget_urls` endpoints use the user guid in the
configuration.

The `GET` endpoint accepts the widget configuration via the URL query
parameters. For example:

```bash
curl "http://localhost:8089/users/USR-081ff65e-3087-4cc2-a2c4-365354e1e6cb/widget_urls?widget_type=connect_widget&mode=verification"
```

The `POST` endpoint accepts the widget configuration via the request body. For
example:

```bash
curl "http://localhost:8089/users/USR-081ff65e-3087-4cc2-a2c4-365354e1e6cb/widget_urls" \
  -H "Content-Type: application/json" \
  --data '{"widget_url": {"widget_type": "connect_widget"}}'
```

## Using the proxy with the Widget SDKs

If you're running the example application in the React Native Widget SDK, add
this to your `config.json` file (just replace `{user guid}` with your user's
guid):

```json
{
    "proxy": "http://localhost:8089/users/{user guid}/widget_urls"
}
```
