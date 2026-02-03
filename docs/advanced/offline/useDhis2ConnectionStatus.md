# useDhis2ConnectionStatus

> This feature can only be used when PWA is enabled in `d2.config.js`. See the [App Platform docs](https://developers.dhis2.org/docs/app-platform/pwa/) for more information.

This hook is used to detect whether or not the app can connect to the DHIS2 server. This can be useful, for example, to make changes in the UI to prevent the user from taking actions that would cause errors while unable to reach the server.

It's designed to detect server connection because checking just the internet connection can lead to problems on DHIS2 instances that are implemented offline, where features or actions might be blocked because the device is offline, even though the app can connect to the DHIS2 server just fine. In these cases, what matters is whether or not the app can connect to the DHIS2 server.

This what the DHIS2 Header Bar uses to show an "Online" or "Offline" badge.

```ts
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'

const { isConnected, isDisconnected, lastConnected } =
    useDhis2ConnectionStatus()
```

## API

| Property         | Type      | Description                                                                                                                                                         |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isConnected`    | `boolean` | Represents whether the app can connect to the DHIS2 server                                                                                                          |
| `isDisconnected` | `boolean` | The opposite of `isConnected`. Provided as a convenience value                                                                                                      |
| `lastConnected`  | `Date`    | The last time the app was able to connect to the server, or `null` when `isConnected` is true. See more [below](#lastconnected-details) about details of this value |

### `lastConnected` details

The value will be persisted locally so it will be consistent across sessions while disconnected.

Since we can’t actually detect the ‘lastConnected’ value between sessions, the `lastConnected` value is set to “now” if the app starts up while disconnected from the server and can’t find an existing value stored from previous sessions.

**Tip!** Given the above caveat, this value is most accurately thought of as “Time since starting to work offline”.

This value can be specific to each app — make sure the ‘appName’ is set in d2.config.js to enable this. Otherwise it will use a value that’s shared between apps.

## Design

This hook is a refinement to `useNetworkStatus`, since it will work for implementations where the server is used locally without internet.

The `isConnected` value is primarily detected by the service worker, which listens to the incidental network traffic of the app and interprets the value from successes and failures of requests.

During periods when there’s no network traffic from the app, “pings” will be used **conservatively** to see if the server is reachable. There are several measures taken to limit the usage of these pings:

-   While the connection status is stable, the intervals between pings will increase exponentially up to a long interval.
-   Any new network traffic from the app will postpone future pings.
-   If the app is not focused, no pings will be sent.

### Supported versions

The pings are only sent for server versions that support them, meaning patch versions 2.40.0, 2.39.2, 2.38.4, and 2.37.10 and after. For unsupported versions, the hook will still use the incidental network traffic to determine a connection status value.
