# Offline tools

!> **WARNING** These features are considered **experimental** and are **subject to breaking changes outside of the normal release cycle.**

The app platform provides some support for PWA features, including a `manifest.json` file for installability and service worker which can provide offline caching. In addition to those features, the app runtime provides support for ["cacheable sections"](advanced/offline/CacheableSections), which are sections of an app that can be individually cached on-demand. The [`useCacheableSection` hook](advanced/offline/CacheableSections#usecacheablesection-api) and the [`CacheableSection` component](advanced/offline/CacheableSections#cacheablesection-api) provide the controls for the section and the wrapper for the section, respectively. The [`useCachedSections` hook](advanced/offline/CacheableSections#usecachedsections-api) returns a list of sections that are stored in the cache and a function that can delete them.

An important tool for offline-capable apps is the [`useDhis2ConnectionStatus` hook](advanced/offline/useDhis2ConnectionStatus.md), which can be used to determine whether or not the app can connect to the DHIS2 server. There is also a [`useOnlineStatus` hook](advanced/offline/useOnlineStatus.md) which returns whether or not the client is connected to the internet, but `useDhis2ConnectionStatus` is probably the one you want to use. On instances where DHIS2 is deployed locally in an environment without internet, `useOnlineStatus` can cause problems, because it will always return `false` even though the app can communicate with the DHIS2 server and therefore function just fine. `useDhis2ConnectionStatus` was created to address this problem.

## Examples

To see some examples of the APIs in use, see the [PWA example app](https://github.com/dhis2/app-platform/tree/master/examples/pwa-app/src/components/) in the platform repository.
