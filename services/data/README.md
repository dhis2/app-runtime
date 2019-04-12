# DHIS2 App Data Service

## Installation

This package is internal to `@dhis2/app-runtime` and should not be installed independently.  `@dhis2/app-service-data` is not currently published to `npm`.  Please install `@dhis2/app-runtime` instead.

## Usage

At the top-level application entry point (i.e. `index.js` in Create React App configurations)

```js
import { DataProvider } from '@dhis2/app-runtime'

export default () => (
    <DataProvider baseUrl="localhost:8080" apiVersion={32}>
        <App />
    </DataProvider>
)
```

To request data from a DHIS2 Core server anywhere in the app:

```js
import { DataQuery } from `@dhis2/app-runtime`

const MyComponent = () => (
  <DataQuery query={{
    me: { resource: 'me' },
    indicators: { resource: 'indicators.json', pageSize: 10 }
  }}>
    ({ error, loading, data }) => {
      if (loading) return '...'
      if (error) return `ERROR: ${error.message}`
      return <div>{JSON.stringify(data)}</div>
    }
  </DataQuery>
)
```

You can also use the cleaner React hooks api:

```js
import { useDataQuery } from '@dhis2/app-runtime'

const MyComponent = () => {
    const { loading, error, data } = useDataQuery({
        me: { resource: 'me' },
        indicators: { resource: 'indicators.json', pageSize: 10 },
    })
    if (loading) return '...'
    if (error) return `ERROR: ${error.message}`
    return <div>{JSON.stringify(data)}</div>
}
```

## Known limitations

-   Only GET requests are currently supported
-   ~`resourcePath` must be a string and cannot be split into `resource`, `query`, etc.~
-   The Provider does no data caching or request de-duplication yet
-   Data should be normalized (~and requested in a normalizable way~) at the provider level to optimize network requests
