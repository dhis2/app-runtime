# DHIS2 Application Runtime

[![npm](https://img.shields.io/npm/v/@dhis2/app-runtime.svg)](https://www.npmjs.com/package/@dhis2/app-runtime)
[![build](https://img.shields.io/travis/dhis2/app-runtime.svg)](https://travis-ci.com/dhis2/app-runtime)
![Dependabot](https://badgen.net/dependabot/dhis2/app-runtime/?icon=dependabot)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

See [@dhis2/app-runtime](./runtime) in the `./runtime` directory for installation and usage.

## Development

```sh
> yarn test # runs yarn test on each directory under ./services, and also in ./runtime
> yarn build # runs yarn test on each directory under ./services, and then in ./runtime
```

## Example

A `create-react-app` example is available at [./examples/cra](./examples/cra). If running `yarn install` locally in the example directory, be sure to run it with `yarn install --force --check-files` so that it pulls in the runtime (specified as a `file:` dependency).

Running `yarn build` at root will automatically update the example app's copy, and running `yarn start` will build the runtime and then start the example.

## Release

Releases run automatically for every commit to the master branch using the [d2 cli](https://github.com/dhis2/cli).

**NEVER PUSH DIRECTLY TO `master`! ALL DEVELOPMENT IN THIS REPOSITORY IS THROUGH PULL REQUESTS**
