# Widget SSO API Proxy

This is a proxy server used to get Widget SSO URLs from our Platform API. Any
configuration that you could normally pass to the Platform API via the request
body or a header can be passed in this server as well. This server expects
request URLs with the following form:

```
http://localhost:8089/<widget>/<user_guid>
```

Where `<widget>` is `connect_widget`, for example, and `<user_guid>` is your
user's guid.

Once the server is running, you can make requests like this:

```
curl localhost:8089/connect_widget/USR-081ff65e-3087-4cc2-a2c4-365354e1e6cb
```

If you're using the example Widget SDK application, add this to your
config.json file (just replace <user guid> with your user's guid):

```json
{
    "proxy": "http://localhost:8089/connect_widget/<user_guid>"
}
```


## Getting started

To get started, simply run `node main` and follow the prompts to create a
configuration file and then start the server. You'll need to have your client's
API information (API key and client ID) as well as a user guid.
