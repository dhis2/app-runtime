# DHIS2 App Data Service

## Installation

```sh
yarn add @dhis2/app-service-data # ONCE THIS IS PUBLISHED, IT'S NOT YET
```

**NB** Please ensure that all webpack bundles reference the same Context, you can do this by adding `@dhis2/app-service-data` to `peerDependencies` (rather than `dependencies`) and webpack `externals` for _library_ builds. Top-level apps should be able to include the dependency directly

## Usage

At the top-level application entry point (i.e. `index.js` in Create React App configurations)

```js
import { Provider } from '@dhis2/app-service-data'

export default () => (
    <Provider baseUrl="localhost:8080" apiVersion={32}>
        <App />
    </Provider>
)
```

To request data from a DHIS2 Core server anywhere in the app:

```js
import { Query } from `@dhis2/app-service-data`

const MyComponent = () => (
  <Query query={{
    indicators: { resource: 'indicators.json', pageSize: 10 }
  }}>
    ({ error, loading, data }) => {
      if (loading) return '...'
      if (error) return `ERROR: ${error.message}`
      return <div>{JSON.stringify(data)}</div>
    }
  </Query>
)
```

You can also use the cleaner React hooks api:

```js
import { useQuery } from '@dhis2/app-service-data'

const MyComponent = () => {
  const { loading, error, data } = useQuery({
    indicators: { resource: 'indicators.json', pageSize: 10 }
  })
  if (loading) return '...'
  if (error) return `ERROR: ${error.message}`
  return <div>{JSON.stringify(data)}</div>
}
``` 

## Known limitations

* Only GET requests are currently supported
~* `resourcePath` must be a string and cannot be split into `resource`, `query`, etc.~
* The Provider does no data caching or request de-duplication yet
* Data should be normalized (and requested in a normalizable way) at the provider level to optimize network requests
