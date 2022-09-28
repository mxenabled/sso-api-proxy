import tap from "tap"
import supertest from "supertest"
import type { SuperTest, Test } from "supertest"
import type { Express } from "express"

import { MxPlatformApi, Configuration } from "mx-platform-node"

import { makeApplication } from "../src/application"
import { server } from "./mocks/platform_api"

const config = {
  clientId: "fake client",
  apiKey: "fake key",
  apiHost: "https://int-api.mx.com",
  defaultUserGuid: "USR-123",
}

const client = new MxPlatformApi(
  new Configuration({
    username: config.clientId,
    password: config.apiKey,
    basePath: config.apiHost,
    baseOptions: {
      headers: {
        Accept: "application/vnd.mx.api.v1+json",
      },
    },
  }),
)

tap.test("Application", async (t) => {
  let app: Express
  let runner: SuperTest<Test>

  t.before(() => server.listen({ onUnhandledRequest: "bypass" }))
  t.beforeEach(() => {
    app = makeApplication(client, config)
    runner = supertest(app)
  })
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

  t.test("GET /mx-sso-proxy", async (t) => {
    const res = await runner.get("/mx-sso-proxy?widget_type=connect_widget")
    t.same(res.status, 200)
    t.same(res.body.widget_url.url, "https://widgets.moneydesktop.com/md/connect_widget/$ssotoken$")
  })

  t.test("GET /mx-sso-proxy", async (t) => {
    const res = await runner.get("/mx-sso-proxy")
    t.same(res.status, 422)
  })

  t.test("POST /mx-sso-proxy", async (t) => {
    const res = await runner
      .post("/mx-sso-proxy")
      .set("Accept", "application/json")
      .send({ widget_url: { widget_type: "connect_widget" } })

    t.same(res.status, 200)
    t.same(res.body.widget_url.url, "https://widgets.moneydesktop.com/md/connect_widget/$ssotoken$")
  })
})
