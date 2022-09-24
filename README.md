# Widget SSO API Proxy

This is a proxy server used to get Widget SSO URLs from our Platform API. Any
configuration that you could normally pass to the Platform API via the request
body or a header can be passed in this server as well.


## Getting started

You'll need to have your client's API information (API key and client ID) and a
user guid handy. To get started, simply run `node start` and follow the
prompts.

## Making requests

The server has two endpoints:

- `GET /users/{user_guid}/widget_urls`
- `POST /users/{user_guid}/widget_urls`

The `GET` endpoint accepts the widget configuration via the URL query
parameters. For example:

```bash
$ curl "http://localhost:8089/users/USR-081ff65e-3087-4cc2-a2c4-365354e1e6cb/widget_urls?widget_type=connect_widget&mode=verification"
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
