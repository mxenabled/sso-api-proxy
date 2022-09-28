# Contributing

## Reporting Bugs

When submitting a new bug report, please first
[search](https://github.com/mxenabled/sso-api-proxy/issues) for an existing or
similar report. If no duplicate exists, file the issue with the following
information:

1. OS name and version.
2. Steps to reproduce the issue.
3. Example code snippet or HTTP request that causes the issue.
4. CLI errors.
4. HTTP errors.

## Development

Clone this repo and install [Node v16](https://nodejs.org/en/download/). Below
are commands we use to perform various tasks:

- `npm install`, install dependencies.
- `npm start`, run the built code (must build first).
- `npm run build`, compile code.
- `npm run test`, run unit tests.
- `npm run test:coverage`, run unit tests and generate code coverage report.
- `npm run lint`, run linter.
- `npm run format`, run code formatter.
- `npm run spellcheck`, run spellchecker.


## Publishing a new version

1. Update `CHANGELOG.md` with any changes that need to be communicated to a
   user of the SDK. See https://keepachangelog.com/en/1.1.0/ for details on
   what and how content should be included.
2. Run `npm version <new version>` to set the new SDK version and create the git
   tag.
3. [Publish new version to npm.](#publishing-to-npm)


### Publishing to npm

You will need permission to publish to the [mxenabled][mxenabled_npm_org]
organization in npm before you can publish this package. Once you are able to
publish, log into npm with `npm login` then run `npm publish` to publish. Note
that running `npm publish` will automatically execute `npm run build` for you.


[mxenabled_npm_org]: https://www.npmjs.com/org/mxenabled "mxenabled npm organization"
