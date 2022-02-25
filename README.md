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

You'll need to have your client's API information (API key and client ID) and a
user guid handy.

To get started, simply run `node main` and follow the prompts. The first time
you start the server, you'll be asked for your client's API information. This
information is then saved to a file named `.env`. If you want to use a
different client, you'll need to either modify or delete this file.
