import tap from "tap"
import supertest from "supertest"

import { MxPlatformApi, Configuration } from "mx-platform-node"

import { makeApplication } from "../src/application"
import { server } from "./mocks/platform_api"

const config = new Configuration({
  username: "fake client",
  password: "fake key",
  basePath: "https://int-api.mx.com",
  baseOptions: {
    headers: {
      Accept: "application/vnd.mx.api.v1+json",
    },
  },
})

const client = new MxPlatformApi(config)
const app = makeApplication(client)
const runner = supertest(app)

tap.test("Application", async (t) => {
  t.before(() => server.listen({ onUnhandledRequest: "bypass" }))
  t.afterEach(() => server.resetHandlers())
  t.teardown(() => server.close())

  t.test("GET /users/{user_guid}/widget_urls", async (t) => {
    const res = await runner.get("/users/USR-123/widget_urls?widget_type=connect_widget")
    t.same(res.status, 200)
    t.same(res.body.widget_url.url, "https://widgets.moneydesktop.com/md/connect_widget/$ssotoken$")
  })

  t.test("GET /users/{user_guid}/widget_urls with missing widget_type", async (t) => {
    const res = await runner.get("/users/USR-123/widget_urls")
    t.same(res.status, 422)
  })

  t.test("POST /users/{user_guid}/widget_urls", async (t) => {
    const res = await runner
      .post("/users/USR-123/widget_urls")
      .set("Accept", "application/json")
      .send({ widget_url: { widget_type: "connect_widget" } })

    t.same(res.status, 200)
    t.same(res.body.widget_url.url, "https://widgets.moneydesktop.com/md/connect_widget/$ssotoken$")
  })
})
