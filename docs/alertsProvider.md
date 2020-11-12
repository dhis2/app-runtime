# AlertsProvider

## Example

```jsx
import { AlertsProvider } from '@dhis2/app-runtime'

export const App = () => (
    <AlertsProvider>{/* App Contents go here */}</AlertsProvider>
)
```

## Usage note

The app-shell wraps the app in an `AlertsProvider` so in a typical DHIS2 app you don't need to use this component.
