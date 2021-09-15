# [2.12.0](https://github.com/dhis2/app-runtime/compare/v2.11.1...v2.12.0) (2021-09-15)


### Features

* **offline:** add 'clear sensitive caches' function ([#1002](https://github.com/dhis2/app-runtime/issues/1002)) ([bb85fe9](https://github.com/dhis2/app-runtime/commit/bb85fe9e98c2921e7cf48abcf9a472d89f1cce78))

## [2.11.1](https://github.com/dhis2/app-runtime/compare/v2.11.0...v2.11.1) (2021-09-02)


### Bug Fixes

* **pkg:** remove unnecessary resolution ([#984](https://github.com/dhis2/app-runtime/issues/984)) ([ff08b91](https://github.com/dhis2/app-runtime/commit/ff08b91758a52da2f54fbeacda8f5745d1542801))

# [2.11.0](https://github.com/dhis2/app-runtime/compare/v2.10.0...v2.11.0) (2021-08-31)


### Features

* add offline service ([#874](https://github.com/dhis2/app-runtime/issues/874)) ([578bd41](https://github.com/dhis2/app-runtime/commit/578bd41678535a293bc537f6d4b3114a693b5869))

# [2.10.0](https://github.com/dhis2/app-runtime/compare/v2.9.2...v2.10.0) (2021-08-30)


### Features

* track 'last online' time in localStorage ([#974](https://github.com/dhis2/app-runtime/issues/974)) ([98d7cd3](https://github.com/dhis2/app-runtime/commit/98d7cd3d289ca92444f17fc66a40aa73f6927f99))

## [2.9.2](https://github.com/dhis2/app-runtime/compare/v2.9.1...v2.9.2) (2021-08-24)


### Bug Fixes

* **online-status:** handle debouncing across rerenders ([#963](https://github.com/dhis2/app-runtime/issues/963)) ([e83bfd1](https://github.com/dhis2/app-runtime/commit/e83bfd18b2f41cd60dec8d99ad743b5c9edb39ea))

## [2.9.1](https://github.com/dhis2/app-runtime/compare/v2.9.0...v2.9.1) (2021-08-16)


### Bug Fixes

* update useOnlineStatus debounce delay when options change ([#960](https://github.com/dhis2/app-runtime/issues/960)) ([4f7c237](https://github.com/dhis2/app-runtime/commit/4f7c237949237ab2262a52770783334a721e94e1))

# [2.9.0](https://github.com/dhis2/app-runtime/compare/v2.8.0...v2.9.0) (2021-08-13)


### Features

* add online status ([#953](https://github.com/dhis2/app-runtime/issues/953)) ([9b45a81](https://github.com/dhis2/app-runtime/commit/9b45a81f074d3dc501b4acb34af8b75893ba8dbf))

# [2.8.0](https://github.com/dhis2/app-runtime/compare/v2.7.1...v2.8.0) (2021-03-10)


### Features

* warn in development mode when  query is missing paging or explicit fields ([#788](https://github.com/dhis2/app-runtime/issues/788)) ([5f28c79](https://github.com/dhis2/app-runtime/commit/5f28c790eb010fea733989bbc242d18b21109b7f))

## [2.7.1](https://github.com/dhis2/app-runtime/compare/v2.7.0...v2.7.1) (2021-03-01)


### Bug Fixes

* support tree-shakable builds and upgrade dependencies ([#780](https://github.com/dhis2/app-runtime/issues/780)) ([1b3ba1d](https://github.com/dhis2/app-runtime/commit/1b3ba1db94cbea87c242b1ec6de5617db697b524))

# [2.7.0](https://github.com/dhis2/app-runtime/compare/v2.6.1...v2.7.0) (2021-01-28)


### Bug Fixes

* **fetch-data:** improve regex for contentType text/* and test ([7746543](https://github.com/dhis2/app-runtime/commit/7746543db9a75cd78bd0e55b4b56b546e2a424f2))


### Features

* **rest-api-link:** parse response to JSON, text, or blob ([d4028f2](https://github.com/dhis2/app-runtime/commit/d4028f24e97d53912f1e3d951e36c680337ab5f4))
* add support for svg conversion endpoint ([61db63f](https://github.com/dhis2/app-runtime/commit/61db63facb56119e91529cb09e45866f72292210))

## [2.6.1](https://github.com/dhis2/app-runtime/compare/v2.6.0...v2.6.1) (2020-11-12)


### Bug Fixes

* patch to fix missing package release ([b190931](https://github.com/dhis2/app-runtime/commit/b190931b8171e8235e4508df926ea0a93634bc19))

# [2.6.0](https://github.com/dhis2/app-runtime/compare/v2.5.1...v2.6.0) (2020-11-12)


### Bug Fixes

* **alerts-service:** adjust message type ([58406e8](https://github.com/dhis2/app-runtime/commit/58406e8d091b49faad02cce1f37223bf4ed396f0))
* **alerts-service:** adjust types for AlertContext and optional props ([a5ad1f2](https://github.com/dhis2/app-runtime/commit/a5ad1f2e59fc05e34db58d4eb2d697c8e571aadf))
* **alerts-service:** any message to string ([f24cc75](https://github.com/dhis2/app-runtime/commit/f24cc75248992036b18482c502afdae711564efc))
* **alerts-service:** bind id to remove ([448a375](https://github.com/dhis2/app-runtime/commit/448a37554284b07c8033ea4dced42a86a18372bb))


### Features

* alerts service ([396b386](https://github.com/dhis2/app-runtime/commit/396b386e4bf6841e1abe59a4f16cdfd76029f8d4))

## [2.5.1](https://github.com/dhis2/app-runtime/compare/v2.5.0...v2.5.1) (2020-11-11)


### Bug Fixes

* cut release to finish jira migration ([8c030e5](https://github.com/dhis2/app-runtime/commit/8c030e5278be3d6eb823276e5d5bd54739280ceb))

# [2.5.0](https://github.com/dhis2/app-runtime/compare/v2.4.0...v2.5.0) (2020-10-27)


### Features

* **rest-api-link:** add support for text/plain and multipart/form-data ([#651](https://github.com/dhis2/app-runtime/issues/651)) ([94e21ad](https://github.com/dhis2/app-runtime/commit/94e21adb4ae3efe577274b827c0191c2b98993b9))

# [2.4.0](https://github.com/dhis2/app-runtime/compare/v2.3.0...v2.4.0) (2020-10-12)


### Features

* add explicit support for systemInfo and serverVersion config props ([#652](https://github.com/dhis2/app-runtime/issues/652)) ([15b8344](https://github.com/dhis2/app-runtime/commit/15b8344b829d88552f0dae337c97f83a902585d1))

# [2.3.0](https://github.com/dhis2/app-runtime/compare/v2.2.2...v2.3.0) (2020-09-16)


### Features

* add tabs, query persistance and ctrl/cmd+enter query execution ([66ff1a5](https://github.com/dhis2/app-runtime/commit/66ff1a550fb10e79c2736549bca16c03df2fb59d))

## [2.2.2](https://github.com/dhis2/app-runtime/compare/v2.2.1...v2.2.2) (2020-06-11)


### Bug Fixes

* support boolean values for query parameters ([#582](https://github.com/dhis2/app-runtime/issues/582)) ([039e77e](https://github.com/dhis2/app-runtime/commit/039e77e60828257153653da4b21c2630734a22a2))

## [2.2.1](https://github.com/dhis2/app-runtime/compare/v2.2.0...v2.2.1) (2020-05-06)


### Bug Fixes

* declare services as runtime dependencies ([76a55c7](https://github.com/dhis2/app-runtime/commit/76a55c754f11d4a4088ca088575622549b0adebb))

# [2.2.0](https://github.com/dhis2/app-runtime/compare/v2.1.2...v2.2.0) (2020-05-06)


### Features

* build with app platform, publish independent services ([#512](https://github.com/dhis2/app-runtime/issues/512)) ([70aa726](https://github.com/dhis2/app-runtime/commit/70aa726d6ddf8c69b94b161dbbbd26c8a0fde089))

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
