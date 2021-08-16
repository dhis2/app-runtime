# Offline tools

## Online status

The `useOnlineStatus` returns the client's online or offline status. It debounces the values by default to prevent rapid changes of any UI elements that depend on the online status.

```jsx
import { useOnlineStatus } from '@dhis2/app-runtime'

const { online, offline } = useOnlineStatus(options)
```

The `online` and `offline` return values are booleans, and both are provided for convenience.

The `options` param is an optional object with the following optional properties:

| Property        | Type   | Default | Description                                                                              |
| --------------- | ------ | ------- | ---------------------------------------------------------------------------------------- |
| `debounceDelay` | Number | `1000`  | Duration in ms to debounce changing `online` values. Set it to `0` to remove debouncing. |

Under the hood, the `online` value is initialized to `navigator.onLine`, then the value changes in response to browser `online` and `offline` events. In the future, the hook may use periodic server pings to detect online status.
