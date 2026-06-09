# DHIS2 App Data Service

Declarative data fetching for [DHIS2](https://dhis2.org) applications

This library is intended for use with the [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Installation

This package is internal to `@dhis2/app-runtime` and generally should not be installed independently.

See [the docs](https://developers.dhis2.org/docs/app-runtime/getting-started) for more.

## TypeScript — typed query responses

`useDataQuery` infers the response type automatically from the query object. The default map covers all DHIS2 v43 metadata endpoints. Three patterns are supported:

### 1. Default — v43 types, fully inferred

Pass the query `as const` so TypeScript can see the literal resource name and field list. No type annotation needed.

```ts
import { useDataQuery } from '@dhis2/app-runtime'

const { data } = useDataQuery({
    dataElements: {
        resource: 'dataElements',
        params: { fields: ['id', 'name', 'valueType'] as const },
    },
} as const)

// data?.dataElements.pager.page                   → number
// data?.dataElements.dataElements[0].id           → string | undefined
// data?.dataElements.dataElements[0].valueType    → ValueType  (enum, not just string)
```

`as const` on the fields array is what allows TypeScript to narrow the element type. Without it the response type is broader but still valid. Without `as const` on the outer object, resource names are not captured as literals and field narrowing is skipped entirely.

### 2. Targeting a specific DHIS2 API version

If the target instance runs an older DHIS2 version, build the result type from that version's paths. `paths` comes from the version-specific entry point; `DeriveResourceTypeMap` and `InferQueryResult` are version-agnostic and always come from `@dhis2/api-types/utils`:

```ts
import { useDataQuery } from '@dhis2/app-runtime'
import type { paths } from '@dhis2/api-types/v42'
import type {
    DeriveResourceTypeMap,
    InferQueryResult,
} from '@dhis2/api-types/utils'

const query = {
    dataElements: {
        resource: 'dataElements',
        params: { fields: ['id', 'name', 'valueType'] as const },
    },
} as const

type Result = InferQueryResult<typeof query, DeriveResourceTypeMap<paths>>

const { data } = useDataQuery<typeof query, Result>(query)
// data?.dataElements.dataElements[0].valueType → v42's ValueType
```

`@dhis2/api-types/v40`, `/v41`, `/v42`, and `/v43` are all available.

### 3. Overriding the inferred type

Pass an explicit result type as the second generic to opt out of inference entirely — useful for custom endpoints or when the inferred type needs to be shaped differently:

```ts
import { useDataQuery } from '@dhis2/app-runtime'

type MyResult = {
    dataElements: {
        pager: {
            page: number
            pageCount: number
            total: number
            pageSize: number
        }
        dataElements: Array<{ id: string; name: string; valueType: string }>
    }
}

const { data } = useDataQuery<typeof query, MyResult>(query)
// data?.dataElements.dataElements[0] → { id: string; name: string; valueType: string }
```

### Tracker resources

Tracker endpoints (`tracker/enrollments`, `tracker/trackedEntities`, etc.) resolve to `unknown` with the default map because the spec types their responses opaquely. Extend the map manually to cover them:

```ts
import { useDataQuery } from '@dhis2/app-runtime'
import type { paths, TrackerEnrollment } from '@dhis2/api-types'
import type {
    DeriveResourceTypeMap,
    InferQueryResult,
} from '@dhis2/api-types/utils'

type TrackerMap = DeriveResourceTypeMap<paths> & {
    'tracker/enrollments': TrackerEnrollment
}

const query = {
    enrollments: {
        resource: 'tracker/enrollments',
        params: { fields: ['enrollment', 'status'] as const },
    },
} as const

type Result = InferQueryResult<typeof query, TrackerMap>

const { data } = useDataQuery<typeof query, Result>(query)
// data?.enrollments.enrollments[0].status → EnrollmentStatus
```
