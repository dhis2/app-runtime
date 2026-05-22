# Data Engine

This document describes the `@dhis2/data-engine` package — the standalone data engine used by the runtime. The engine provides a small, framework-agnostic interface for executing queries and mutations through a pluggable transport link.

Manually constructing a Data Engine is most useful when running server-side javascript, for example in Node or in server-side Next.js code.

## Overview

The `DataEngine` class is a thin wrapper around transport "links". Links are responsible for translating resource queries into network requests. The most common link to use is `RestAPILink` which handles communication with the DHIS2 Rest API

The DataEngine can be used to imperatively execute [Query](../types/Query.md) and [Mutation](../types/Mutation.md) objects. The engine is used internally by the App Runtime, which should be preferred when in a React context.

## Installation

Install the package from npm:

```bash
npm install @dhis2/data-engine
# or
yarn add @dhis2/data-engine
```

## Quick start

```typescript
import {
    DataEngine,
    RestAPILink,
    type DataEngineConfig,
} from '@dhis2/data-engine'

// Specify the configuration object and construct a RestAPILink
const config: DataEngineConfig = {
    baseUrl: 'https://my-dhis2-server.com',
    apiToken: 'MY_PERSONAL_ACCESS_TOKEN',
}
const link = new RestAPILink(config)

// Construct the DataEngine using the RestAPILink
const engine = new DataEngine(link)

// Simple query
const data = await engine.query({
    me: { resource: 'me' },
})

// Simple mutation
const result = await engine.mutate({
    type: 'create',
    resource: 'dataValues',
    data: {
        /* ... */
    },
})

// Convenience fetch helpers
await engine.get('/api/organisationUnits')
await engine.post('/api/resource', { some: 'body' })
```

## Configuration

The following configuration properties are supported:

| property        | required | description                                                                                                        |
| --------------- | -------: | ------------------------------------------------------------------------------------------------------------------ |
| `baseUrl`       |      yes | Base URL of the DHIS2 server (for example: https://play.dhis2.org)                                                 |
| `serverVersion` |       no | Optional server version object with fields `major`, `minor`, optional `patch`, and `full` string (see table below) |
| `apiToken`      |       no | Optional API token (personal access token) used for authentication when using token-based auth                     |

Server version fields:

| property | required | description                               |
| -------- | -------: | ----------------------------------------- |
| `major`  |      yes | Major server version number               |
| `minor`  |      yes | Minor server version number               |
| `patch`  |       no | Patch version number (optional)           |
| `full`   |      yes | Full server version string, e.g. `2.38.0` |

The server version is used to toggle different features which are only supported with certain DHIS2 server versions. If it is not supplied, the DataEngine will operate assuming an older version of DHIS2.

In the future, the DataEngine may optionally fetch this automatically from the server's `/system/info` endpoint

## Authentication

Unlike in browser contexts, where authentication is transmitted via HTTP-only session cookies, server environments need another way to authenticate API requests. To accomplish this, the config object supports an `apiToken` property which should be a Personal Access Token granting access to the target DHIS2 instance.

**SECURITY NOTE** Do NOT use personal access tokens in browser environments. PATs should always be stored securely and passed to server scripts in secure ways, for example using environment variables or secret vaults instead of command-line arguments.

## API

The primary exported class is `DataEngine` which can be constructed as follows:

`new DataEngine(link: DataEngineLink)` — Construct a new engine using the given link.

To construct a RestAPI link, pass a configuration object to the following constructor:

`new RestAPILink(config: DataEngineConfig)` - Construct a new RestAPILink for communication with a specific DHIS2 server

The Engine returned has the following methods:

- `query(query: Query, options?: QueryExecuteOptions): Promise<T>` — Execute one or more resource queries. The `query` parameter is an object mapping keys to `ResourceQuery` objects; the returned value is an object mapping the same keys to their results.
- `mutate(mutation: Mutation, options?: QueryExecuteOptions): Promise<unknown>` — Execute a mutation. Supported mutation types include `create`, `update`, `delete`, etc., depending on the link implementation.
- `fetch(path: string, init?: RequestInit, executeOptions?: QueryExecuteOptions)` — Run a fetch-style request through the engine. Absolute URLs are not supported; paths are resolved against the server base.
- Convenience methods: `get`, `post`, `put`, `patch`, `jsonPatch`, `delete` — thin wrappers around `fetch` with the appropriate HTTP method.

### `QueryExecuteOptions`

Common options supported by `query` and `mutate`:

- `variables` — Object with variables to resolve dynamic queries.
- `signal` — `AbortSignal` to cancel the request.
- `onComplete` — Callback invoked with the result when the request completes.
- `onError` — Callback invoked when the request errors.

### Notes on `fetch`

- `fetch` will map the provided `init` (method, body, headers) to either a `query` or `mutation` call internally. If the computed type is `read` it will call `query` and return the `result` property; otherwise it will call `mutate`.
- `jsonPatch(path, patches, options)` sends a PATCH request with `Content-Type: application/json-patch+json`.
- Absolute URLs (paths containing `://`) are rejected to avoid cross-origin usage through the engine.

## Examples

Query multiple resources in a single call:

```javascript
const data = await engine.query({
    users: { resource: 'users', params: { paging: false } },
    me: { resource: 'me' },
})

console.log(data.users) // list of users
console.log(data.me) // current user
```

Using `fetch` convenience methods:

```javascript
const unit = await engine.get('/api/organisationUnits/abc')

await engine.jsonPatch('/api/resource/123', [
    { op: 'replace', path: '/name', value: 'New name' },
])
```

## Using in React

The DataEngine has been moved to a standalone package without a React dependency. This makes it easier to reuse in non-React contexts.

In React contexts using the DHIS2 App Platform, the engine is created automatically and can be accessed using the [useDataEngine hook](../hooks/useDataEngine.md).
