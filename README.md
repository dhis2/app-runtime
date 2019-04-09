# DHIS2 Application Runtime

See [@dhis2/app-runtime](./runtime) in the `./runtime` directory for installation and usage.

## Development

```sh
> yarn test # runs yarn test on each directory under ./services, and also in ./runtime
> yarn build # runs yarn test on each directory under ./services, and then in ./runtime
```

## Example

A `create-react-app` example is available at [./examples/cra](./examples/cra). Be sure to run `yarn build` in _this_ directory before installing in the example directory:'

```sh
> yarn build
> cd examples/cra && yarn start
# visit http://localhost:3000
# login to https://play.dhis2.org/dev to allow the example to retrieve data
```

## Release

Releases run automatically for every commit to the master branch using the [d2 cli](https://github.com/dhis2/cli).

**NEVER PUSH DIRECTLY TO `master`! ALL DEVELOPMENT IN THIS REPOSITORY IS THROUGH PULL REQUESTS**
