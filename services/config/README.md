# DHIS2 App Config Service

## Installation

This package is internal to `@dhis2/app-runtime` and should not be installed independently.  `@dhis2/app-service-config` is not currently published to `npm`.  Please install `@dhis2/app-runtime` instead.

## Usage

At the top-level application entry point (i.e. `index.js` in Create React App configurations)

```js
import { DataProvider } from '@dhis2/app-runtime'

const config = {
    baseUrl: 'http://localhost:8080',
    apiVersion: 33
}

export default () => (
    <Provider config={config}>
        <App />
    </Provider>
)
```

To access this configuration data somewhere within `<App>` (using React Hooks):

```js
import { useConfig } from '@dhis2/app-runtime'

const MyComponent = () => {
    const { baseUrl, apiVersion } = useConfig()

    return <div>
        <span>Base URL: {baseUrl}</span>
        <span>API Version: {apiVersion}</span>
    </div>
}
```
