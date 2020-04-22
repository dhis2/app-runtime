## [2.1.2](https://github.com/dhis2/app-runtime/compare/v2.1.1...v2.1.2) (2020-04-22)


### Bug Fixes

* **parsestatus:** add response data to error ([#510](https://github.com/dhis2/app-runtime/issues/510)) ([5c124db](https://github.com/dhis2/app-runtime/commit/5c124db595ae538dc515b246cd8910e16cdf2a8e))

## [2.1.1](https://github.com/dhis2/app-runtime/compare/v2.1.0...v2.1.1) (2020-03-24)


### Bug Fixes

* expand array of filters to multiple filter querystring params ([#462](https://github.com/dhis2/app-runtime/issues/462)) ([aee9993](https://github.com/dhis2/app-runtime/commit/aee9993086813ffe215ed7733b2de8f902d0bc9c))

# [2.1.0](https://github.com/dhis2/app-runtime/compare/v2.0.4...v2.1.0) (2020-02-25)


### Features

* support lazy query and mutation hook option ([#412](https://github.com/dhis2/app-runtime/issues/412)) ([e9b73ca](https://github.com/dhis2/app-runtime/commit/e9b73cac0afcb292454e8b50e5e4812d442f8950))

## [2.0.4](https://github.com/dhis2/app-runtime/compare/v2.0.3...v2.0.4) (2019-11-06)


### Bug Fixes

* stop infinite rerenders when prop identity changes ([#253](https://github.com/dhis2/app-runtime/issues/253)) [defer-release] ([88f8333](https://github.com/dhis2/app-runtime/commit/88f833300e4508f82e99d4d2d0d6e715b1e774fd))
* update loading and error state when manually aborting ([#254](https://github.com/dhis2/app-runtime/issues/254)) ([68f717d](https://github.com/dhis2/app-runtime/commit/68f717d51a7ec6ff01db0062a0b676a7000a9a2f))

## [2.0.3](https://github.com/dhis2/app-runtime/compare/v2.0.2...v2.0.3) (2019-10-21)


### Bug Fixes

* typos in README ([#205](https://github.com/dhis2/app-runtime/issues/205)) ([a6b8fc1](https://github.com/dhis2/app-runtime/commit/a6b8fc1c14970942a86cdb94ffc588ad49b814e8))

## [2.0.2](https://github.com/dhis2/app-runtime/compare/v2.0.1...v2.0.2) (2019-09-30)


### Bug Fixes

* add runtime query validation ([#160](https://github.com/dhis2/app-runtime/issues/160)) ([a8d2d5e](https://github.com/dhis2/app-runtime/commit/a8d2d5e))

## [2.0.1](https://github.com/dhis2/app-runtime/compare/v2.0.0...v2.0.1) (2019-09-24)


### Bug Fixes

* correctly parse content type ([#138](https://github.com/dhis2/app-runtime/issues/138)) ([bbaaa65](https://github.com/dhis2/app-runtime/commit/bbaaa65))

# [2.0.0](https://github.com/dhis2/app-runtime/compare/v1.5.1...v2.0.0) (2019-09-24)


### BREAKING CHANGES

* mutations, dynamic queries, engine refactor ([#127](https://github.com/dhis2/app-runtime/issues/127)) ([8677972](https://github.com/dhis2/app-runtime/commit/8677972)), closes [#115](https://github.com/dhis2/app-runtime/issues/115)

## [1.5.1](https://github.com/dhis2/app-runtime/compare/v1.5.0...v1.5.1) (2019-08-25)


### Bug Fixes

* stop infinite rerenders by removing query from useEffect deps ([#88](https://github.com/dhis2/app-runtime/issues/88)) ([ac9fa28](https://github.com/dhis2/app-runtime/commit/ac9fa28))

# [1.5.0](https://github.com/dhis2/app-runtime/compare/v1.4.3...v1.5.0) (2019-08-15)


### Bug Fixes

* don't silently ignore test failures, fix data reduce bug ([95fd038](https://github.com/dhis2/app-runtime/commit/95fd038))


### Features

* support network request aborting and refetching ([#34](https://github.com/dhis2/app-runtime/issues/34)) ([dcb4a70](https://github.com/dhis2/app-runtime/commit/dcb4a70))

## [1.4.3](https://github.com/dhis2/app-runtime/compare/v1.4.2...v1.4.3) (2019-08-14)


### Bug Fixes

* support independent data provider, refactor example ([#70](https://github.com/dhis2/app-runtime/issues/70)) ([7db27f6](https://github.com/dhis2/app-runtime/commit/7db27f6))

## [1.4.2](https://github.com/dhis2/app-runtime/compare/v1.4.1...v1.4.2) (2019-08-12)


### Bug Fixes

* update all babel deps to match latest (7.5.5) ([#48](https://github.com/dhis2/app-runtime/issues/48)) ([1148d85](https://github.com/dhis2/app-runtime/commit/1148d85))

## [1.4.1](https://github.com/dhis2/app-runtime/compare/v1.4.0...v1.4.1) (2019-08-08)


### Bug Fixes

* don't break app-runtime API, export DataProvider as well ([#33](https://github.com/dhis2/app-runtime/issues/33)) ([14a33f0](https://github.com/dhis2/app-runtime/commit/14a33f0))

# [1.4.0](https://github.com/dhis2/app-runtime/compare/v1.3.0...v1.4.0) (2019-08-08)


### Features

* expose application config as separate context ([#13](https://github.com/dhis2/app-runtime/issues/13)) ([c9aa123](https://github.com/dhis2/app-runtime/commit/c9aa123))

# [1.3.0](https://github.com/dhis2/app-runtime/compare/v1.2.0...v1.3.0) (2019-07-09)


### Features

* support action queries with prefixed resource names ([#19](https://github.com/dhis2/app-runtime/issues/19)) ([c5c5dc7](https://github.com/dhis2/app-runtime/commit/c5c5dc7))

# [1.2.0](https://github.com/dhis2/app-runtime/compare/v1.1.0...v1.2.0) (2019-05-27)


### Features

* support forever-loading CustomDataProvider ([#11](https://github.com/dhis2/app-runtime/issues/11)) ([e80c7b7](https://github.com/dhis2/app-runtime/commit/e80c7b7))

# [1.1.0](https://github.com/dhis2/app-runtime/compare/v1.0.0...v1.1.0) (2019-04-15)


### Features

* rename MockProvider to CustomProvider and expose it ([#8](https://github.com/dhis2/app-runtime/issues/8)) ([2411fbc](https://github.com/dhis2/app-runtime/commit/2411fbc))

# [1.0.0](https://github.com/dhis2/app-runtime/compare/v0.1.0...v1.0.0) (2019-04-09)


### Features

* cut version 1 ([#4](https://github.com/dhis2/app-runtime/issues/4)) ([8e97028](https://github.com/dhis2/app-runtime/commit/8e97028))


### BREAKING CHANGES

* cut version 1.0

* feat: update app-runtime exports, add readmes
* docs: add root readme
