# useOnlineStatus

!> This hook only detects whether or not you're connected to the internet, which could be problematic for DHIS2 instances that are hosted locally or offline, where what really matters is whether or not you can communicate with the DHIS2 server. The [`useDhis2ConnectionStatus` hook](./useDhis2ConnectionStatus.md) is usually better for that reason, and is therefore recommended.

The `useOnlineStatus` returns whether the client is online or offline. It debounces the returned values by default to prevent rapid changes of any UI elements that depend on the online status.

```jsx
import { useOnlineStatus } from '@dhis2/app-runtime'

const { online, offline } = useOnlineStatus(options)
```

The `online` and `offline` return values are booleans, and both are provided for convenience.

The `options` param is an optional object with the following optional properties:

| Property        | Type   | Default | Description                                                                              |
| --------------- | ------ | ------- | ---------------------------------------------------------------------------------------- |
| `debounceDelay` | Number | `1000`  | Duration in ms to debounce changing `online` values. Set it to `0` to remove debouncing. |

Under the hood, the `online` value is initialized to `navigator.onLine`, then the value changes in response to browser `online` and `offline` events.
