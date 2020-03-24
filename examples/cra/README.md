## Installation

To ensure that the local dependency on `@dhis2/app-runtime@file:../../` is updated, install with `yarn install --check-files`

## USAGE

This sample application requests data from the public-facing API at [localhost:8080](http://localhost:8080). Cookies are used for authentication, the DataRequest component will receive an `Unauthorized` error if you are not currently logged in.

## CONFIGURATION

The behavior of the example application can be controlled using the following environment variables:

-   **REACT_APP_D2_BASE_URL**: The base url passed to the Provider _(default `http://localhost:8080`)_
-   **REACT_APP_D2_API_VERSION**: The API version passed to the Provider _(default `33`)_
-   **REACT_APP_D2_PROVIDER_TYPE**: The type of Provider to use _(options `runtime`[default], `data`)_
