# DHIS2 Application Runtime

A singular runtime dependency for applications on the DHIS2 platform

## Installation

```sh
yarn add @dhis2/app-runtime
```

**NB** Please ensure that all webpack bundles reference the same Context, you can do this by adding `@dhis2/app-runtime` to `peerDependencies` (rather than `dependencies`) and webpack `externals` for _library_ builds. Top-level web applications should be able to include the dependency directly

This library uses the official React Context API (introduced in 16.3) and React Hooks (introduced in 16.8), so **React >= 16.8 is required** to use it

## Required Polyfills

The following must be polyfilled to support older and non-compliant browsers (i.e. IE11):

* es6.promise (i.e. [core-js/features/promise](https://github.com/zloirock/core-js))
* window.fetch (i.e. [whatwg-fetch](https://github.com/github/fetch))
* AbortController / AbortSignal (i.e. [abortcontroller-polyfill](https://www.npmjs.com/package/abortcontroller-polyfill))


## Usage

See [the docs](https://runtime.dhis2.nu) for usage and examples
