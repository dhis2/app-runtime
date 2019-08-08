# DHIS2 Application Runtime

[![Greenkeeper badge](https://badges.greenkeeper.io/dhis2/app-runtime.svg)](https://greenkeeper.io/)

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
