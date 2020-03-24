# Services

!> **NOTE**<br/>Services are purely a concept **internal** to `@dhis2/app-runtime` - you don't need to care about them to use it.

Internally, `@dhis2/app-runtime` is composed of several functionally-isolated **services**. Each of these services is a private (unpublished) npm package which is bundled into the final `@dhis2/app-runtime` library at build-time. Each services exposes a relevant Context provider as well as various Hook and Component interfaces which are re-exported by the `@dhis2/app-runtime` public package. There are currently only 2 services, but more will be added soon.

-   [**Config**](https://github.com/dhis2/app-runtime/blob/master/services/config) - Provide access to basic application configuration values from anywhere within an application. _NOTE: this services is special because it can be a dependency of other services!_
-   [**Data**](https://github.com/dhis2/app-runtime/blob/master/services/data) - Provides a declarative data access interface and data engine which will eventually handle caching, deduplication, and fetching of DHIS2 data (anything accessible through the DHIS2 Core API)
