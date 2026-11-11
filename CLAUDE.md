# CLAUDE.md — app-runtime

## Repo structure

Yarn workspaces monorepo:

- `engine/` — `@dhis2/data-engine`: the core fetch/mutation layer; this is where query aliasing, abort handling, and the `RestAPILink` live
- `runtime/` — `@dhis2/app-runtime`: React bindings (`useDataQuery`, `useDataMutation`, etc.) that wrap the engine
- `services/` — standalone service packages (config, alerts, etc.)
- `integration/` — integration test workspace; runs against a live DHIS2 instance (see `integration/CLAUDE.md`)

## Common commands

```sh
yarn build                    # build everything (config → engine → services → runtime)
yarn build:engine             # build engine only (needed before integration tests)
yarn test                     # unit tests for engine + services + runtime
yarn test:integration:local   # spin up Docker stack, run integration tests, tear down
yarn test:integration         # run integration tests against an already-running instance
yarn lint
```

## Engine internals — query aliasing

When `RestAPILink` receives an HTTP 414 response, it POSTs the long URL to `/api/{version}/query/alias` to get a short alias URL, caches the result in an `LRUCache` (`link.queryAliasCache`), and retries the original request using the alias. The cache is intentionally public so integration tests can seed or inspect it.

The alias expiry path (when a cached alias returns a stale 404) uses the response `statusText` to detect expiry. This is known-broken over HTTP/2 (statusText is always empty). The integration test for this case accepts either a successful recreation or a clean `FetchError` for that reason.

## Never push directly to master

All changes go through pull requests. Releases are cut automatically by CI on every merge.
