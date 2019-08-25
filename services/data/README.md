# DHIS2 App Data Service

## Installation

This package is internal to `@dhis2/app-runtime` and should not be installed independently.  `@dhis2/app-service-data` is not currently published to `npm`.  Please install `@dhis2/app-runtime` instead.

See [the docs](../../docs) for more.

## Known limitations

-   Only GET requests are currently supported
-   ~`resourcePath` must be a string and cannot be split into `resource`, `query`, etc.~
-   The Provider does no data caching or request de-duplication yet
-   Data should be normalized (~and requested in a normalizable way~) at the provider level to optimize network requests
