# Getting Started

[![npm](https://img.shields.io/npm/v/@dhis2/app-runtime.svg)](https://www.npmjs.com/package/@dhis2/app-runtime)

A singular runtime dependency for applications on the DHIS2 platform

## Installation

```bash
> yarn add @dhis2/app-runtime
```

> Please ensure that all webpack bundles reference the same Context, you can do this by adding `@dhis2/app-runtime` to `peerDependencies` (rather than `dependencies`) and webpack `externals` for _library_ builds. Top-level web applications should be able to include the dependency directly

## Requirements

### React >= 16.8

This library uses the official React Context API (introduced in 16.3) and React Hooks (introduced in 16.8), so **React >= 16.8 is required** to use it

### Polyfills

The following must be polyfilled to support older and non-compliant browsers (i.e. IE11):

* es6.promise (i.e. [core-js/features/promise](https://github.com/zloirock/core-js))
* window.fetch (i.e. [whatwg-fetch](https://github.com/github/fetch))
* AbortController / AbortSignal (i.e. [abortcontroller-polyfill](https://www.npmjs.com/package/abortcontroller-polyfill))