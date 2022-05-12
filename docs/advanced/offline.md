# Offline tools

!> **WARNING** These features are considered **experimental** and are **subject to breaking changes outside of the normal release cycle.**

The app platform provides some support for PWA features, including a `manifest.json` file for installability and service worker which can provide offline caching. In addition to those features, the app runtime provides support for "cacheable sections", which are sections of an app that can be individually cached on-demand. The [`useCacheableSection`](#usecacheablesection-api) hook and the [`CacheableSection`](#cacheablesection-api) component provide the controls for the section and the wrapper for the section, respectively. The [`useCachedSections`](#usecachedsections-api) hook returns a list of sections that are stored in the cache and a function that can delete them.

There is also a [`useOnlineStatus`](#online-status) hook which returns the online or offline status of the client.

To see a good example of these functions' APIs and their usage, see `SectionWrapper.js` in the [PWA example app](https://github.com/dhis2/app-platform/tree/master/examples/pwa-app/src/components/SectionWrapper.js) in the platform repository.

## Cacheable sections

> This feature can only be used when PWA is enabled in `d2.config.js`. See the [App Platform docs](https://platform.dhis2.nu/#/pwa/pwa) for more information.

These features are supported by an `<OfflineProvider>` component which the app platform provides to the app.

### How it works

Cacheable sections enable sections of an app to be individually cached offline on demand. Using the `CacheableSection` wrapper and the `useCacheableSection` hook, when a user requests a section to be cached for offline use, the section's component tree will rerender, and the app's service worker will listen to all the network traffic for the component to cache it offline. To avoid caching that components' data before a user requests to do so, you can use the [URL filters feature](https://platform.dhis2.nu/#/pwa/pwa?id=opting-in) in `d2.config.js`.

Note that, without using these features, an app using offline caching will cache all the data that is requested by user as they use the app without needing to use cacheable sections.

Keep an eye out for this feature in use in the Dashboards app coming soon!

### Usage

Wrap the component to be cached in a `CacheableSection` hook, providing an `id` and `loadingMask` prop. The loading mask should block the screen from interaction, and it will be rendered while the component is in 'recording mode'. Note that the `useCacheableSection` hook _does not need to be used in the same component_ as the `<CacheableSection>`, they just need to use the same `id`. There is an example of this in the file linked below.

Here is an example of the basic usage:

```jsx
import { CacheableSection, useCacheableSection } from '@dhis2/app-runtime'
import { Button, Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import { Dashboard } from './Dashboard'

/** An example loading mask */
const LoadingMask = () => (
    <Layer translucent>
        <CenteredContent>
            <CircularLoader />
        </CenteredContent>
    </Layer>
)

export function CacheableSectionWrapper({ id }) {
    const { startRecording, isCached, lastUpdated } = useCacheableSection(id)

    return (
        <div>
            <p>{isCached ? `Last updated: ${lastUpdated}` : 'Not cached'}</p>
            <Button onClick={startRecording}>
            <CacheableSection id={id} loadingMask={<LoadingMask />}>
                <Dashboard id={id} />
            </CacheableSection>
        </div>
    )
}
```

#### `CacheableSection` API

| Prop          | Type      | Required? | Description                                                                                                                                                                                                 |
| ------------- | --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`    | Component | Yes       | Section that will be cached upon recording                                                                                                                                                                  |
| `id`          | String    | Yes       | ID of the section to be cached. Should match the ID used in the `useCacheableSection` hook.                                                                                                                 |
| `loadingMask` | Component | Yes       | A UI mask that should block the screen from interaction. While the component is rerendering and recording, this mask will be rendered to block user interaction which may interfere with the recorded data. |

#### `useCacheableSection` API

```jsx
import { useCacheableSections } from '@dhis2/app-runtime'

function DemoComponent() {
    const { startRecording, remove, lastUpdated, isCached, recordingState } =
        useCacheableSection(id)
}
```

`useCacheableSection` takes an `id` parameter (a string) and returns an object with the following properties:

| Property         | Type     | Description                                                                                                                                                                                                                                                                                                 |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `startRecording` | Function | Initiates recording of a cacheable section's data for offline use. Causes a `<CacheableSection>` component with a matching ID to rerender with a loading mask based on the recording state to initiate the network requests. See the full API in the [`startRecording`](#startrecording-api) section below. |
| `remove`         | Function | Removes this section from offline storage. Returns a promise that resolves to `true` if the section was successfully removed or `false` if that section was not found in offline storage.                                                                                                                   |
| `lastUpdated`    | Date     | A timestamp of the last time this section was successfully recorded.                                                                                                                                                                                                                                        |
| `isCached`       | Boolean  | `true` if this section is in offline storage; Provided for convenience.                                                                                                                                                                                                                                     |
| `recordingState` | String   | One of `'default'`, `'pending'`, `'recording'`, or `'error'`. Under the hood, the `CacheableSection` component changes how its children are rendered based on the states. They are returned here in case an app wants to change UI or behavior based on the recording state.                                |

#### `startRecording` API

The `startRecording` function returned by `useCacheableSection` returns a promise that resolves if 'start recording' signal is sent successfully or rejects if there is an error with the offline interface initiating recording. It accepts an `options` parameter with the following optional properties:

| Property                | Type     | Default | Description                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onStarted`             | Function |         | A callback to be called once a recording has started and the service worker is listening to network requests. Receives no arguments                                                                                                                                                                                                          |
| `onCompleted`           | Function |         | A callback to be called when the recording has completed successfully. Receives no arguments                                                                                                                                                                                                                                                 |
| `onError`               | Function |         | A callback to be called in the case of an error during recording. Receives an `error` object as an argument                                                                                                                                                                                                                                  |
| `recordingTimeoutDelay` | Number   | `1000`  | The time (in ms) to wait after all pending network requests have finished before stopping a recording. If a user's device is slow, and there might be long pauses between requests that are necessary for that section to run offline, this number may need to be increased from its default to prevent recording from stopping prematurely. |

Example:

```jsx
import { useCacheableSection } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'

function StartRecordingButton({ id }) {
    const { startRecording } = useCacheableSection(id)

    function handleStartRecording() {
        startRecording({
            onStarted: () => console.log('Recording started'),
            onCompleted: () => console.log('Recording completed'),
            onError: (err) => console.error(err),
            recordingTimeoutDelay: 1000, // the default
        })
            .then(() => console.log('startRecording signal sent successfully'))
            .catch((err) =>
                console.error(`Error when starting recording: ${err}`)
            )
    }

    return <Button onClick={handleStartRecording}>Save offline</Button>
}
```

#### `useCachedSections` API

The `useCachedSections` hook returns a list of all the sections that are cached, which can be useful if an app needs to manage that whole list at once. It takes no arguments and it returns an object with the following properties:

| Property             | Type     | Description                                                                                                                                                                                                                                                                               |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cachedSections`     | Object   | An object of cached sections' statuses, where the keys are the section IDs and the values are objects with a `lastUpdated` property that holds a `Date` object reflecting the time this section was last updated.                                                                         |
| `removeById`         | Function | Receives an `id` parameter and attempts to remove the section with that ID from the offline cache. If successful, updates the cached sections list. Returns a promise that resolves to `true` if that section is successfully removed or `false` if a section with that ID was not found. |
| `syncCachedSections` | Function | Syncs the list of cached sections with the list in IndexedDB. Returns a promise. This is handled by the `removeById` function and is probably not necessary to use in most applications.                                                                                                  |

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
