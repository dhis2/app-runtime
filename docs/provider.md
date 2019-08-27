# Provider

## Input Props

| Name | Type | Description |
|:--------:|:----:|-------------|
| **config** | [*Config*](types/Config.md) | The application configuration |

## Example

```jsx
import { Provider } from '@dhis2/app-runtime'

const appConfig = {
    baseUrl: 'play.dhis2.org/dev',
    apiVersion: 33,
}

export const App = () => (
    <Provider config={appConfig}>
        {/* App Contents go here */}
    </Provider>
)
```