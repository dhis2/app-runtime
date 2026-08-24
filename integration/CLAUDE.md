# CLAUDE.md — integration tests

Tests in this workspace run against a live DHIS2 instance. See `README.md` for setup and quickstart.

## Before running tests

Tests import from `@dhis2/data-engine` (the **built** package). Always run `yarn build:engine` from the repo root first, otherwise you'll be testing a stale build.

## Why Vitest, not Jest

This workspace uses **Vitest** instead of `d2-app-scripts test` (which wraps Jest 27):

- **`fetch` is available without a polyfill** — Vitest runs tests in a real Node.js process. Jest 27's node environment sandboxes globals and doesn't inherit Node 18+'s native `fetch`, which required adding a `cross-fetch` polyfill and a `setupFiles` entry just to make HTTP calls work.
- **TypeScript works natively** — no babel transform config or tsconfig juggling needed.
- **No config fighting** — `d2-app-scripts` merges its React/jsdom defaults on top of your config. There's no clean way to opt out of jsdom without fighting the merge order (spread position matters and is an internal implementation detail).
- **`globalSetup` is first-class** — Vitest's `globalSetup` exports named `setup`/`teardown` functions directly; Jest's default-export convention needed ts-node to compile the file.

If you're wondering why we don't use `d2-app-scripts test` like the rest of the repo: the integration workspace is not a React app. It's a plain Node.js test suite that makes real HTTP calls. `d2-app-scripts` is the right tool for testing DHIS2 app components; Vitest is the right tool here.

## Shared helpers

All test files import config, auth, and engine factory from `tests/helpers.ts`. Do not duplicate config loading or `makeEngine()`/`makeLink()` inline in test files.

## nginx.conf is load-bearing

`nginx.conf` sets `large_client_header_buffers 4 1k`. This is intentional and must not be changed. It causes nginx to return HTTP 414 for any request URL longer than ~1 KB, which is what triggers the query alias fallback in `engine/src/links/RestAPILink/fetchData.ts`.

If you remove nginx from the stack or raise this limit, `tests/queryAlias.test.ts` will silently pass through long URLs without exercising the alias path at all.

## dhis.conf uses env var substitution

`dhis.conf` contains `${DB_HOSTNAME}`, `${DB_NAME}`, etc. The `dhis2/core` Docker image entrypoint runs `envsubst` on the mounted file before starting DHIS2. The values come from the environment variables on the `dhis2` service in `docker-compose.yml`. The file itself is still required — the image won't start without a mounted `dhis.conf`.

## Default port is 18080

The nginx proxy binds to `${DHIS2_HTTP_PORT:-18080}` (not 8080) to avoid clashing with a locally running DHIS2 instance. `globalSetup.ts` and CI both default to `http://localhost:18080`.

## globalSetup writes a config file

On startup, `globalSetup.ts` polls DHIS2 until it's ready (up to 5 min), creates a PAT via Basic auth, and writes `{ baseUrl, apiToken, apiVersion }` to `.integration-config.json`. Test files read this file first and fall back to env vars — this is how the PAT is shared across all test suites without each suite needing admin credentials.
