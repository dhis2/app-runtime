# Integration tests

Run the full DHIS2 stack locally and exercise `@dhis2/app-runtime` against real API responses.

## Prerequisites

- Docker and Docker Compose v2 (`docker compose version`)
- Node 18+
- The engine built (`yarn build:engine` from repo root)

## Quickstart

Run everything in one command from the repo root:

```sh
yarn test:integration:local
```

This starts the Docker stack, runs all tests, and tears down afterwards. Or step by step:

```sh
# 1. Build the engine (required — tests import the built package)
yarn build:engine

# 2. Install integration deps (standalone workspace — must be done separately)
yarn --cwd integration install

# 3. Start the stack (first run takes 3–5 min while DHIS2 initialises)
docker compose -f integration/docker-compose.yml up

# 4. Run the tests (in a separate terminal)
yarn test:integration

# 5. Tear down
docker compose -f integration/docker-compose.yml down -v
```

> **Note**: `integration/` is intentionally not part of the root Yarn workspaces so that `yarn build` never accidentally picks it up. Its `node_modules` are managed independently.

## Environment variables

| Variable            | Default                  | Description                                                                 |
| ------------------- | ------------------------ | --------------------------------------------------------------------------- |
| `DHIS2_BASE_URL`    | `http://localhost:18080` | Base URL of the DHIS2 instance                                              |
| `DHIS2_USERNAME`    | `admin`                  | Admin user for initial token bootstrap                                      |
| `DHIS2_PASSWORD`    | `district`               | Admin password                                                              |
| `DHIS2_API_VERSION` | `43`                     | API version number                                                          |
| `DHIS2_HTTP_PORT`   | `18080`                  | Host port for the nginx proxy (avoids conflicts with a local DHIS2 on 8080) |

Point at a shared dev server instead of Docker:

```sh
DHIS2_BASE_URL=https://play.dhis2.org/dev yarn test:integration
```

## Stack details

The Docker stack (`docker-compose.yml`) includes:

- **PostgreSQL 13** — database
- **DHIS2 Core 2.43** — application server
- **nginx** — reverse proxy configured with `large_client_header_buffers 4 1k` so URLs longer than ~1 KB return HTTP 414, triggering the query alias path under test. **Do not change this limit** — it is what makes `queryAlias.test.ts` exercise real alias behaviour.

## Test files

| File                       | What it covers                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `tests/dataEngine.test.ts` | Basic read queries: current user, paginated collections, parallel queries, field filtering, error handling |
| `tests/apiToken.test.ts`   | PAT lifecycle: create via API, authenticate requests, reject after revocation                              |
| `tests/queryAlias.test.ts` | Long-URI (HTTP 414) handling: alias creation via POST, transparent retry, LRU cache reuse                  |
| `tests/mutations.test.ts`  | Full CRUD on `dataStore` (create/replace/update/json-patch/delete) and abort/cancel                        |

## CI

Integration tests run on every PR alongside unit tests. On `master` merges — and on any failure — results are posted to `#team-extensibility-notifications` on Slack.
