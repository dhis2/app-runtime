## Installation

To ensure that the local dependency on `@dhis2/app-runtime@file:../../` is updated, install with `yarn install --check-files`

## USAGE

This sample application requests data from the public-facing API at [play.dhis2.org/dev](https://play.dhis2.org/dev).  Cookies are used for authentication, the DataRequest component will receive an `Unauthorized` error if you are not currently logged in.
