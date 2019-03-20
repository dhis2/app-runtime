# DHIS2 App Data Service

## Installation

```sh
yarn add @dhis2/app-service-data
```

**NB** Please ensure that all webpack bundles reference the same Context, you can do this by adding `@dhis2/app-service-data` to `peerDependencies` (rather than `dependencies`) and webpack `externals` for _library_ builds. Top-level apps should be able to include the dependency directly

## Usage

At the top-level application entry point (i.e. `index.js` in Create React App configurations)

```js
import { DataProvider } from '@dhis2/app-service-data'

export default () => (
    <DataProvider baseUrl="localhost:8080" apiVersion={32}>
        <App />
    </DataProvider>
)
```

To request data from a DHIS2 Core server anywhere in the app:

```js
import { DataRequest } from `@dhis2/app-service-data`

const MyComponent = () => (
  <DataRequest resourcePath="indicators.json?pageLimit=10">
    ({ error, loading, data }) => {
      if (loading) return '...'
      if (error) return `ERROR: ${error.message}`
      return <div>{JSON.stringify(data)}</div>
    }
  </DataRequest>
)
```

## Known limitations

* Only GET requests are currently supported
* `resourcePath` must be a string and cannot be split into `resource`, `query`, etc.
* The Provider does no data caching or request de-duplication yet
