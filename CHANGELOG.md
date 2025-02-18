## [3.13.2](https://github.com/dhis2/app-runtime/compare/v3.13.1...v3.13.2) (2025-02-11)


### Bug Fixes

* **plugin:** avoid sending prop updates when height and width values change ([#1406](https://github.com/dhis2/app-runtime/issues/1406)) ([d263c25](https://github.com/dhis2/app-runtime/commit/d263c2534870f6d8673cea077f99f840ff94c909))

## [3.13.1](https://github.com/dhis2/app-runtime/compare/v3.13.0...v3.13.1) (2025-02-04)


### Bug Fixes

* **plugin:** don't send prop update when changing plugin source ([#1404](https://github.com/dhis2/app-runtime/issues/1404)) ([3ae0295](https://github.com/dhis2/app-runtime/commit/3ae0295ccb57f6b1f9509774a8f9b1603bdf3379))

# [3.13.0](https://github.com/dhis2/app-runtime/compare/v3.12.1...v3.13.0) (2025-01-23)


### Features

* new plugin sizing default and options ([#1398](https://github.com/dhis2/app-runtime/issues/1398)) ([d2554c1](https://github.com/dhis2/app-runtime/commit/d2554c1a00ecf57518e16719861e1e236bbdff50))

## [3.12.1](https://github.com/dhis2/app-runtime/compare/v3.12.0...v3.12.1) (2025-01-16)


### Bug Fixes

* reference module types in package.json export declaration ([#1400](https://github.com/dhis2/app-runtime/issues/1400)) ([c266429](https://github.com/dhis2/app-runtime/commit/c2664291626c9360ffa618ea05d67584bb7caa7a))

# [3.12.0](https://github.com/dhis2/app-runtime/compare/v3.11.3...v3.12.0) (2024-12-04)


### Bug Fixes

* **cacheable-section:** synchronously flush recording state for UI consistency ([#1394](https://github.com/dhis2/app-runtime/issues/1394)) ([50d216c](https://github.com/dhis2/app-runtime/commit/50d216cb4b7a98995b327cb997bcf6bbd873ea18))
* **deps:** remove cli-app-scripts peer dep ([7764439](https://github.com/dhis2/app-runtime/commit/776443957cf7bce70d644459b946dc9382dd9103))
* **deps:** update cli-app-scripts for package/types race condition ([7980364](https://github.com/dhis2/app-runtime/commit/79803646c152a805277b123250124a272f178d99))


### Features

* upgrade app-runtime React version to v18 ([#1387](https://github.com/dhis2/app-runtime/issues/1387)) ([0e4a3d5](https://github.com/dhis2/app-runtime/commit/0e4a3d5c0e9cf8884c1a46f32fa0876234b6d765))
* upgrade react query to v4 ([#1395](https://github.com/dhis2/app-runtime/issues/1395)) ([8b02fdf](https://github.com/dhis2/app-runtime/commit/8b02fdff62c175a115a68863be456db117c3ea5e))

# [3.12.0-alpha.2](https://github.com/dhis2/app-runtime/compare/v3.12.0-alpha.1...v3.12.0-alpha.2) (2024-12-03)


### Features

* upgrade react query to v4 ([#1395](https://github.com/dhis2/app-runtime/issues/1395)) ([8b02fdf](https://github.com/dhis2/app-runtime/commit/8b02fdff62c175a115a68863be456db117c3ea5e))

# [3.12.0-alpha.1](https://github.com/dhis2/app-runtime/compare/v3.11.3...v3.12.0-alpha.1) (2024-11-27)


### Bug Fixes

* **cacheable-section:** synchronously flush recording state for UI consistency ([#1394](https://github.com/dhis2/app-runtime/issues/1394)) ([50d216c](https://github.com/dhis2/app-runtime/commit/50d216cb4b7a98995b327cb997bcf6bbd873ea18))
* **deps:** remove cli-app-scripts peer dep ([7764439](https://github.com/dhis2/app-runtime/commit/776443957cf7bce70d644459b946dc9382dd9103))
* **deps:** update cli-app-scripts for package/types race condition ([7980364](https://github.com/dhis2/app-runtime/commit/79803646c152a805277b123250124a272f178d99))


### Features

* upgrade app-runtime React version to v18 ([#1387](https://github.com/dhis2/app-runtime/issues/1387)) ([0e4a3d5](https://github.com/dhis2/app-runtime/commit/0e4a3d5c0e9cf8884c1a46f32fa0876234b6d765))

## [3.11.3](https://github.com/dhis2/app-runtime/compare/v3.11.2...v3.11.3) (2024-11-19)


### Bug Fixes

* add endpoint to text plain matchers ([#1390](https://github.com/dhis2/app-runtime/issues/1390)) ([bc25458](https://github.com/dhis2/app-runtime/commit/bc254581f65ec22104144f596032f40d670a73ce))

## [3.11.2](https://github.com/dhis2/app-runtime/compare/v3.11.1...v3.11.2) (2024-10-14)


### Bug Fixes

* expand FetchErrorDetails type ([#1389](https://github.com/dhis2/app-runtime/issues/1389)) ([ff0ad60](https://github.com/dhis2/app-runtime/commit/ff0ad6077aecdb7627ec985a61c159159be6b8ea))

## [3.11.1](https://github.com/dhis2/app-runtime/compare/v3.11.0...v3.11.1) (2024-10-09)


### Bug Fixes

* handle alert returned async by parentAlertsAdd [LIBS-695] ([#1388](https://github.com/dhis2/app-runtime/issues/1388)) ([9c989b2](https://github.com/dhis2/app-runtime/commit/9c989b2f9c408b7d5988dd0ec8756e86ddf2632f))

# [3.11.0](https://github.com/dhis2/app-runtime/compare/v3.10.6...v3.11.0) (2024-09-10)


### Features

* fixed dimensions efficiency ([#1386](https://github.com/dhis2/app-runtime/issues/1386)) ([2b07a14](https://github.com/dhis2/app-runtime/commit/2b07a14ea7e781c1948cfa651a4ad5759a811c79))

## [3.10.6](https://github.com/dhis2/app-runtime/compare/v3.10.5...v3.10.6) (2024-07-26)


### Bug Fixes

* **cacheable-section:** stable references to avoid loops [LIBS-642] ([#1385](https://github.com/dhis2/app-runtime/issues/1385)) ([e3a5fbf](https://github.com/dhis2/app-runtime/commit/e3a5fbfd3e290cc68493a97adbbd27b9f3dca082))

## [3.10.5](https://github.com/dhis2/app-runtime/compare/v3.10.4...v3.10.5) (2024-06-24)


### Bug Fixes

* update plugin sizing definition ([#1383](https://github.com/dhis2/app-runtime/issues/1383)) ([266dc49](https://github.com/dhis2/app-runtime/commit/266dc49423516189cf4dee706cc78e720af744e2))

## [3.10.4](https://github.com/dhis2/app-runtime/compare/v3.10.3...v3.10.4) (2024-04-09)


### Bug Fixes

* **deps:** remove cli-app-scripts peer dep [LIBS-587] ([#1379](https://github.com/dhis2/app-runtime/issues/1379)) ([3598375](https://github.com/dhis2/app-runtime/commit/3598375a826304b61b9b2cbd279043531628dc70))

## [3.10.3](https://github.com/dhis2/app-runtime/compare/v3.10.2...v3.10.3) (2024-03-20)


### Bug Fixes

* plugin documentation typo ([#1376](https://github.com/dhis2/app-runtime/issues/1376)) ([e51dfb9](https://github.com/dhis2/app-runtime/commit/e51dfb9aa856f6f4c9cfd843d773f6c4a79a52e3))

## [3.10.2](https://github.com/dhis2/app-runtime/compare/v3.10.1...v3.10.2) (2024-01-04)


### Bug Fixes

* force npm release ([dfefaed](https://github.com/dhis2/app-runtime/commit/dfefaed0441e418405e9b59c2a021e5d7835a426))


### Features

* release experimental plugin wrappers [LIBS-397] [skip release] ([#1366](https://github.com/dhis2/app-runtime/issues/1366)) ([7895bb9](https://github.com/dhis2/app-runtime/commit/7895bb9b7ffea3673c755b489011f4baf4216483))

# [3.11.0-alpha.1](https://github.com/dhis2/app-runtime/compare/v3.10.1...v3.11.0-alpha.1) (2023-12-21)


### Bug Fixes

* add back plugin service dependency [LIBS-583] ([ca10691](https://github.com/dhis2/app-runtime/commit/ca10691ba01be083379db54ea2ec29f1666955a8))
* add back plugin service dependency [LIBS-583] ([6d43ae3](https://github.com/dhis2/app-runtime/commit/6d43ae3688814ec3ae1f969123d63bd8e80146ce))
* add documentation, clean up ([c537590](https://github.com/dhis2/app-runtime/commit/c537590176b2e6aebf278653a87705b3417bcc38))
* add in plugin service in runtime package ([#1343](https://github.com/dhis2/app-runtime/issues/1343)) ([ed06a9f](https://github.com/dhis2/app-runtime/commit/ed06a9f4af7d3db40600ffd7e1b03cd095db36fc))
* add width to plugin documentation [LIBS-487] ([b2c6273](https://github.com/dhis2/app-runtime/commit/b2c62732bf37e6d52b30f155b68c8b126068e8e5))
* check memomized props for postMessage communication [LIBS-514] ([b1a3a0a](https://github.com/dhis2/app-runtime/commit/b1a3a0a4aeadc234aa181a9af2f176d0ca8d505c))
* clean up ([e53ecbd](https://github.com/dhis2/app-runtime/commit/e53ecbd0632e35681e135de9072169e6bfefe13c))
* clean up, add useless test ([b14952b](https://github.com/dhis2/app-runtime/commit/b14952b137971f625283c8de60afac061176b80e))
* custom error handling ([c72fc6e](https://github.com/dhis2/app-runtime/commit/c72fc6eac576ce043ab706e13030497a0dab3d3a))
* dependency array ([03ce64f](https://github.com/dhis2/app-runtime/commit/03ce64fb65af73190ec920d8d720250ec2ba3715))
* dependency resolution ([2480c1c](https://github.com/dhis2/app-runtime/commit/2480c1c6b82daaeee0ab82ef45962fbcabd0e778))
* merge issues ([496472a](https://github.com/dhis2/app-runtime/commit/496472a458f745d01890dec505d6ddb9259378d1))
* move eslint disable line ([48912d7](https://github.com/dhis2/app-runtime/commit/48912d76630d5490b983e5e730a7d82d06762148))
* plugin experimental docs ([be215b2](https://github.com/dhis2/app-runtime/commit/be215b2c292e451662b72043f20921d42bf36d33))
* prevent sending updated props to plugin when props do not change [LIBS-514] ([86c6f75](https://github.com/dhis2/app-runtime/commit/86c6f75cf2e14a0d8f6f4b86f2d6de7403de62c6))
* reset communication on either pluginSource or pluginShortName change ([3fdae5b](https://github.com/dhis2/app-runtime/commit/3fdae5becf3af038fef8ca5f0be7ecec44680600))
* temporarily disable failing test ([6664199](https://github.com/dhis2/app-runtime/commit/666419955d0f1f70c7b101a49d7440dcd33857a0))
* trigger props resend when iframe src changes [LIBS-488] ([f4a6680](https://github.com/dhis2/app-runtime/commit/f4a668004fe2f97d77e3c74a6047246cf358ade4))
* trigger props resend when iframe src changes [LIBS-488] [#1344](https://github.com/dhis2/app-runtime/issues/1344) ([cea7600](https://github.com/dhis2/app-runtime/commit/cea760040d919508b1e13158dbf47ca9ed3686f6))
* type error ([9c17206](https://github.com/dhis2/app-runtime/commit/9c17206a6942776f4c90c662153677ae9c00c350))
* update alpha branch [skip release] ([ccb793c](https://github.com/dhis2/app-runtime/commit/ccb793c1e125484f39415cbedf1789a5de193e3d))
* working autorsize width ([2991045](https://github.com/dhis2/app-runtime/commit/29910456aca9739848cac403c48a2ac4e64be1e3))


### Features

* add autoresizing for height ([dbb6e26](https://github.com/dhis2/app-runtime/commit/dbb6e265e0b3b01dfe975538703fcdde7c5f2b53))
* experimental plugin release ([f5cca86](https://github.com/dhis2/app-runtime/commit/f5cca86924afa995d916aab2a1b58348b6dcaee7))
* ideas for plugin wrappers [LIBS-397] ([be38607](https://github.com/dhis2/app-runtime/commit/be38607698b12309af5b79259afbbf037e7027bc))
* implement plugin wrappers (alpha) ([#1332](https://github.com/dhis2/app-runtime/issues/1332)) ([56a9a3f](https://github.com/dhis2/app-runtime/commit/56a9a3fb734e07c6c2d8140c6413222b42be82a1))
* plugin experimental export ([25f02a6](https://github.com/dhis2/app-runtime/commit/25f02a6c97733b79ff1aed5e8c4c1726c16144fe))
* plugin wrappers, errors + alerts ([bda6a43](https://github.com/dhis2/app-runtime/commit/bda6a4352fe0ad8a076f55040e3fe702f9d0c4eb))
* update plugin wrappers ([30c963c](https://github.com/dhis2/app-runtime/commit/30c963c112b2865ae824c7e3ce06279ed374983c))

# [3.10.0-alpha.8](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.7...v3.10.0-alpha.8) (2023-12-20)


### Bug Fixes

* plugin experimental docs ([be215b2](https://github.com/dhis2/app-runtime/commit/be215b2c292e451662b72043f20921d42bf36d33))


### Features

* experimental plugin release ([f5cca86](https://github.com/dhis2/app-runtime/commit/f5cca86924afa995d916aab2a1b58348b6dcaee7))
* plugin experimental export ([25f02a6](https://github.com/dhis2/app-runtime/commit/25f02a6c97733b79ff1aed5e8c4c1726c16144fe))

# [3.10.0-alpha.7](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.6...v3.10.0-alpha.7) (2023-12-20)


### Bug Fixes

* check memomized props for postMessage communication [LIBS-514] ([b1a3a0a](https://github.com/dhis2/app-runtime/commit/b1a3a0a4aeadc234aa181a9af2f176d0ca8d505c))
* dependency array ([03ce64f](https://github.com/dhis2/app-runtime/commit/03ce64fb65af73190ec920d8d720250ec2ba3715))
* move eslint disable line ([48912d7](https://github.com/dhis2/app-runtime/commit/48912d76630d5490b983e5e730a7d82d06762148))
* prevent sending updated props to plugin when props do not change [LIBS-514] ([86c6f75](https://github.com/dhis2/app-runtime/commit/86c6f75cf2e14a0d8f6f4b86f2d6de7403de62c6))
* type error ([9c17206](https://github.com/dhis2/app-runtime/commit/9c17206a6942776f4c90c662153677ae9c00c350))

# [3.10.0-alpha.6](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.5...v3.10.0-alpha.6) (2023-10-09)


### Bug Fixes

* add back plugin service dependency [LIBS-583] ([ca10691](https://github.com/dhis2/app-runtime/commit/ca10691ba01be083379db54ea2ec29f1666955a8))
* add back plugin service dependency [LIBS-583] ([6d43ae3](https://github.com/dhis2/app-runtime/commit/6d43ae3688814ec3ae1f969123d63bd8e80146ce))

# [3.10.0-alpha.5](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.4...v3.10.0-alpha.5) (2023-09-28)


### Bug Fixes

* merge issues ([496472a](https://github.com/dhis2/app-runtime/commit/496472a458f745d01890dec505d6ddb9259378d1))
* reset communication on either pluginSource or pluginShortName change ([3fdae5b](https://github.com/dhis2/app-runtime/commit/3fdae5becf3af038fef8ca5f0be7ecec44680600))
* trigger props resend when iframe src changes [LIBS-488] ([f4a6680](https://github.com/dhis2/app-runtime/commit/f4a668004fe2f97d77e3c74a6047246cf358ade4))
* trigger props resend when iframe src changes [LIBS-488] [#1344](https://github.com/dhis2/app-runtime/issues/1344) ([cea7600](https://github.com/dhis2/app-runtime/commit/cea760040d919508b1e13158dbf47ca9ed3686f6))

# [3.10.0-alpha.2](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.1...v3.10.0-alpha.2) (2023-03-15)

### Bug Fixes

* add in plugin service in runtime package ([#1343](https://github.com/dhis2/app-runtime/issues/1343)) ([ed06a9f](https://github.com/dhis2/app-runtime/commit/ed06a9f4af7d3db40600ffd7e1b03cd095db36fc))

# [3.10.0-alpha.4](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.3...v3.10.0-alpha.4) (2023-09-28)


### Bug Fixes

* add width to plugin documentation [LIBS-487] ([b2c6273](https://github.com/dhis2/app-runtime/commit/b2c62732bf37e6d52b30f155b68c8b126068e8e5))
* clean up ([e53ecbd](https://github.com/dhis2/app-runtime/commit/e53ecbd0632e35681e135de9072169e6bfefe13c))
* temporarily disable failing test ([6664199](https://github.com/dhis2/app-runtime/commit/666419955d0f1f70c7b101a49d7440dcd33857a0))
* working autorsize width ([2991045](https://github.com/dhis2/app-runtime/commit/29910456aca9739848cac403c48a2ac4e64be1e3))


### Features

* add autoresizing for height ([dbb6e26](https://github.com/dhis2/app-runtime/commit/dbb6e265e0b3b01dfe975538703fcdde7c5f2b53))

# [3.10.0-alpha.3](https://github.com/dhis2/app-runtime/compare/v3.10.0-alpha.2...v3.10.0-alpha.3) (2023-08-22)


### Bug Fixes

* **connection-status:** responsiveness to online events [LIBS-497] ([#1348](https://github.com/dhis2/app-runtime/issues/1348)) ([91a3d4d](https://github.com/dhis2/app-runtime/commit/91a3d4d820e6a87b819334bd72709c1de1a777f5))
* **types:** add generic result type to oncomplete param ([#1350](https://github.com/dhis2/app-runtime/issues/1350)) ([a069603](https://github.com/dhis2/app-runtime/commit/a069603b4f3b2c9caa2158d7b4087e432cf90668))
* [DHIS2] Type generic T = QueryResult to useDataQuery ([#1297](https://github.com/dhis2/app-runtime/issues/1297)) ([7c5c083](https://github.com/dhis2/app-runtime/commit/7c5c08308b919f70acac5cba6c2b851e4a6e50fa))
* account for daylight savings time [LIBS-490] ([06eaa5d](https://github.com/dhis2/app-runtime/commit/06eaa5d5a0d3d4f69f701a3031610310d2d37ccf))
* account for daylight savings time [LIBS-490] [#1345](https://github.com/dhis2/app-runtime/issues/1345) ([fb00533](https://github.com/dhis2/app-runtime/commit/fb00533008e828f7c9fa17f959dcc375fca8b6bd))
* add test for when time zones are the same [LIBS-490] ([7911f8b](https://github.com/dhis2/app-runtime/commit/7911f8b992aabc34a1451144660a34b6b5035286))

## [3.9.4](https://github.com/dhis2/app-runtime/compare/v3.9.3...v3.9.4) (2023-06-19)


### Bug Fixes

* **types:** add generic result type to oncomplete param ([#1350](https://github.com/dhis2/app-runtime/issues/1350)) ([a069603](https://github.com/dhis2/app-runtime/commit/a069603b4f3b2c9caa2158d7b4087e432cf90668))

## [3.9.3](https://github.com/dhis2/app-runtime/compare/v3.9.2...v3.9.3) (2023-05-16)


### Bug Fixes

* add documentation, clean up ([c537590](https://github.com/dhis2/app-runtime/commit/c537590176b2e6aebf278653a87705b3417bcc38))
* clean up, add useless test ([b14952b](https://github.com/dhis2/app-runtime/commit/b14952b137971f625283c8de60afac061176b80e))
* custom error handling ([c72fc6e](https://github.com/dhis2/app-runtime/commit/c72fc6eac576ce043ab706e13030497a0dab3d3a))
* dependency resolution ([2480c1c](https://github.com/dhis2/app-runtime/commit/2480c1c6b82daaeee0ab82ef45962fbcabd0e778))


### Features

* ideas for plugin wrappers [LIBS-397] ([be38607](https://github.com/dhis2/app-runtime/commit/be38607698b12309af5b79259afbbf037e7027bc))
* implement plugin wrappers (alpha) ([#1332](https://github.com/dhis2/app-runtime/issues/1332)) ([56a9a3f](https://github.com/dhis2/app-runtime/commit/56a9a3fb734e07c6c2d8140c6413222b42be82a1))
* plugin wrappers, errors + alerts ([bda6a43](https://github.com/dhis2/app-runtime/commit/bda6a4352fe0ad8a076f55040e3fe702f9d0c4eb))
* update plugin wrappers ([30c963c](https://github.com/dhis2/app-runtime/commit/30c963c112b2865ae824c7e3ce06279ed374983c))
* **connection-status:** responsiveness to online events [LIBS-497] ([#1348](https://github.com/dhis2/app-runtime/issues/1348)) ([91a3d4d](https://github.com/dhis2/app-runtime/commit/91a3d4d820e6a87b819334bd72709c1de1a777f5))

## [3.9.2](https://github.com/dhis2/app-runtime/compare/v3.9.1...v3.9.2) (2023-05-02)


### Bug Fixes

* [DHIS2] Type generic T = QueryResult to useDataQuery ([#1297](https://github.com/dhis2/app-runtime/issues/1297)) ([7c5c083](https://github.com/dhis2/app-runtime/commit/7c5c08308b919f70acac5cba6c2b851e4a6e50fa))

## [3.9.1](https://github.com/dhis2/app-runtime/compare/v3.9.0...v3.9.1) (2023-04-11)


### Bug Fixes

* account for daylight savings time [LIBS-490] ([06eaa5d](https://github.com/dhis2/app-runtime/commit/06eaa5d5a0d3d4f69f701a3031610310d2d37ccf))
* account for daylight savings time [LIBS-490] [#1345](https://github.com/dhis2/app-runtime/issues/1345) ([fb00533](https://github.com/dhis2/app-runtime/commit/fb00533008e828f7c9fa17f959dcc375fca8b6bd))
* add test for when time zones are the same [LIBS-490] ([7911f8b](https://github.com/dhis2/app-runtime/commit/7911f8b992aabc34a1451144660a34b6b5035286))

# [3.9.0](https://github.com/dhis2/app-runtime/compare/v3.8.0...v3.9.0) (2023-03-02)


### Features

* dhis2 connection status [LIBS-315] ([#1203](https://github.com/dhis2/app-runtime/issues/1203)) ([6a4156e](https://github.com/dhis2/app-runtime/commit/6a4156e26b14c0f838bc02d69d0879826f342277))

# [3.8.0](https://github.com/dhis2/app-runtime/compare/v3.7.0...v3.8.0) (2023-01-19)


### Features

* add hook to adjust for server time [LIBS-396] ([#1308](https://github.com/dhis2/app-runtime/issues/1308)) ([d511303](https://github.com/dhis2/app-runtime/commit/d51130336ce8ada00ef5e79884263c678e252302))

# [3.7.0](https://github.com/dhis2/app-runtime/compare/v3.6.2...v3.7.0) (2022-11-17)


### Features

* **fetch-error:** expose fetch-error ([bcb913c](https://github.com/dhis2/app-runtime/commit/bcb913c4910d42a5300752f43d7636e7cf950f8a))

## [3.6.2](https://github.com/dhis2/app-runtime/compare/v3.6.1...v3.6.2) (2022-11-16)


### Bug Fixes

* send POST body to indicators/expression/description as text plain ([#1286](https://github.com/dhis2/app-runtime/issues/1286)) ([82d26d4](https://github.com/dhis2/app-runtime/commit/82d26d425ecb035521e18e3f692279b15918025c))

## [3.6.1](https://github.com/dhis2/app-runtime/compare/v3.6.0...v3.6.1) (2022-10-24)


### Bug Fixes

* **offline:** clear SWR caches betwen users [LIBS-358] ([#1268](https://github.com/dhis2/app-runtime/issues/1268)) ([fc0d143](https://github.com/dhis2/app-runtime/commit/fc0d143261c580df44ec8a492673847fbb72c3f6))

# [3.6.0](https://github.com/dhis2/app-runtime/compare/v3.5.0...v3.6.0) (2022-10-19)


### Features

* offline status messaging ([#1258](https://github.com/dhis2/app-runtime/issues/1258)) ([f22e1f3](https://github.com/dhis2/app-runtime/commit/f22e1f3aeb944a952999cb0cf2ae200a834099a5))

# [3.5.0](https://github.com/dhis2/app-runtime/compare/v3.4.4...v3.5.0) (2022-10-06)


### Features

* extended config type to include app name, version, and version strings ([#1252](https://github.com/dhis2/app-runtime/issues/1252)) ([4170674](https://github.com/dhis2/app-runtime/commit/4170674e39f70c5af6760f0e19d9e1555714e1d2))

## [3.4.4](https://github.com/dhis2/app-runtime/compare/v3.4.3...v3.4.4) (2022-06-08)


### Bug Fixes

* **data-service:** application/x-www-form-urlencoded for svg conversion ([5e2818c](https://github.com/dhis2/app-runtime/commit/5e2818c8d63f9ede61d65ca431f0604201d31531))

## [3.4.3](https://github.com/dhis2/app-runtime/compare/v3.4.2...v3.4.3) (2022-04-06)


### Bug Fixes

* use unversioned api endpoint for tracker sub-resources ([#1158](https://github.com/dhis2/app-runtime/issues/1158)) ([1af1ca7](https://github.com/dhis2/app-runtime/commit/1af1ca7024eb0b1b7172cfa82a573cd3d5684aa9))

## [3.4.2](https://github.com/dhis2/app-runtime/compare/v3.4.1...v3.4.2) (2022-04-05)


### Bug Fixes

* ensure refetch function has stable identity ([9fc3cb4](https://github.com/dhis2/app-runtime/commit/9fc3cb4537d07f89d4501a08fb513f3f491971ac))

## [3.4.1](https://github.com/dhis2/app-runtime/compare/v3.4.0...v3.4.1) (2022-03-22)


### Bug Fixes

* use unversioned api endpoint for tracker resource before 2.38 [LIBS-289] ([#1144](https://github.com/dhis2/app-runtime/issues/1144)) ([b696974](https://github.com/dhis2/app-runtime/commit/b696974d2b766f31ea50ea3c473aeca108ed1708))

# [3.4.0](https://github.com/dhis2/app-runtime/compare/v3.3.0...v3.4.0) (2022-03-15)


### Features

* **data-service:** add json-patch support ([#1023](https://github.com/dhis2/app-runtime/issues/1023)) ([cdcdf24](https://github.com/dhis2/app-runtime/commit/cdcdf24ecb1ae810ab4985d15fe49939da097c90))

# [3.3.0](https://github.com/dhis2/app-runtime/compare/v3.2.9...v3.3.0) (2022-02-26)


### Features

* use form-data for dataValues endpoints ([#1133](https://github.com/dhis2/app-runtime/issues/1133)) ([a67b926](https://github.com/dhis2/app-runtime/commit/a67b926db147ab880df9a23a02e3c41d47e845dc))

## [3.2.9](https://github.com/dhis2/app-runtime/compare/v3.2.8...v3.2.9) (2022-02-08)


### Bug Fixes

* **custom-data-link:** allow falsey values for resources ([#1112](https://github.com/dhis2/app-runtime/issues/1112)) ([75f3528](https://github.com/dhis2/app-runtime/commit/75f3528fe588d1ec95d657d5cbbca7896e549305))

## [3.2.8](https://github.com/dhis2/app-runtime/compare/v3.2.7...v3.2.8) (2022-01-27)


### Bug Fixes

* match also eventVisualization in isCreateInterpretation ([f630a78](https://github.com/dhis2/app-runtime/commit/f630a78767705751e2d9b2bf4a72fd9dcdbbead4))

## [3.2.7](https://github.com/dhis2/app-runtime/compare/v3.2.6...v3.2.7) (2021-12-07)


### Bug Fixes

* **use-data-query:** prevent double request on refetch with new variables ([#1086](https://github.com/dhis2/app-runtime/issues/1086)) ([4f4663c](https://github.com/dhis2/app-runtime/commit/4f4663c375ce2ccaf61137939f9e9256661a13f0))

## [3.2.6](https://github.com/dhis2/app-runtime/compare/v3.2.5...v3.2.6) (2021-11-23)


### Bug Fixes

* **data-service:** identify interpretation update requests correctly ([38045a3](https://github.com/dhis2/app-runtime/commit/38045a33f271c56640d2580609c00a75053ccb9c))
* **data-service:** identify interpretation update requests correctly ([63d4ea2](https://github.com/dhis2/app-runtime/commit/63d4ea228c521227d9bca0221a0d3d475025a907))

## [3.2.5](https://github.com/dhis2/app-runtime/compare/v3.2.4...v3.2.5) (2021-11-15)


### Bug Fixes

* **use-data-query:** memoize refetch function ([1b7a42f](https://github.com/dhis2/app-runtime/commit/1b7a42f3592074bbe0fc2798a60b81423159962a))

## [3.2.4](https://github.com/dhis2/app-runtime/compare/v3.2.3...v3.2.4) (2021-10-20)


### Bug Fixes

* **offline-provider:** avoid side-effects if PWA is disabled ([b56e9a4](https://github.com/dhis2/app-runtime/commit/b56e9a42593d12f88d7b5aa809979348c408229a))

## [3.2.3](https://github.com/dhis2/app-runtime/compare/v3.2.2...v3.2.3) (2021-10-07)


### Bug Fixes

* **offline:** remove offlineInterface.init() functionality ([01c4c49](https://github.com/dhis2/app-runtime/commit/01c4c49b7af47bd2bc18a20fa751b084889fe7dc))

## [3.2.2](https://github.com/dhis2/app-runtime/compare/v3.2.1...v3.2.2) (2021-09-28)


### Bug Fixes

* **offline-interface:** improve SW update message ([d2f4631](https://github.com/dhis2/app-runtime/commit/d2f463112a1e74497c1ae5c43412bbdeb2de8a26))

## [3.2.1](https://github.com/dhis2/app-runtime/compare/v3.2.0...v3.2.1) (2021-09-27)


### Bug Fixes

* **clear-caches:** allow caches.keys to fail ([885ff81](https://github.com/dhis2/app-runtime/commit/885ff810a178ebfff3dd81a059539f6fb5ff723c))

# [3.2.0](https://github.com/dhis2/app-runtime/compare/v3.1.0...v3.2.0) (2021-09-17)


### Bug Fixes

* **offline:** return correct value from clearSensitiveCaches ([#1008](https://github.com/dhis2/app-runtime/issues/1008)) ([4b68b22](https://github.com/dhis2/app-runtime/commit/4b68b22cf7adc5c335c98d4746e20f602ecbbc85))


### Features

* **offline:** add 'clear sensitive caches' function ([01749aa](https://github.com/dhis2/app-runtime/commit/01749aa9fe16e6b2329bc7bea76e05cf81e39757))

# [3.1.0](https://github.com/dhis2/app-runtime/compare/v3.0.0...v3.1.0) (2021-09-13)


### Features

* **alerts-service:** let useAlert return a hide function (LIBS-114) ([3436312](https://github.com/dhis2/app-runtime/commit/34363125c9df295eb4d304f05adc4913231d6093))

# [3.0.0](https://github.com/dhis2/app-runtime/compare/v2.11.1...v3.0.0) (2021-09-07)


### Features

* **custom-data-provider:** include react-query provider in custom-data-provider ([99ff732](https://github.com/dhis2/app-runtime/commit/99ff732521f80dbe6431586ebe0b99f93ed2f080))
* **use-data-query:** use react-query to cache and deduplicate queries ([87fdcd8](https://github.com/dhis2/app-runtime/commit/87fdcd841e0fa6f299b2363773233c191d874ce0))


### BREAKING CHANGES

* **use-data-query:** loading will only be set to true when fetching and if there is no data. If there
is data, loading will be false during fetching. This means that stale data will be shown during
fetches by default. If you'd like to opt out of showing stale data during loading you can use the
new `fetching` attribute that is now returned by the useDataQuery hook instead.
* **use-data-query:** If you're using cli-app-scripts, these changes need @dhis2/cli-app-scripts version
7.1.1 or above. Since this is an optional peer-dependency you'll need to ensure you're using the
proper version.
* **use-data-query:** The DataProvider is now a required parent for all components that use the
useDataQuery hook. For apps that use the dhis2 app-platform this will be done automatically, but
for libraries (and storybook testing) you'll have to do this manually.
* **use-data-query:** The variables supplied to refetch are not allowed to contain circular references.
* **use-data-query:** The data and error values will not be cleared during a refetch (this allows for
the opt-in stale-while-revalidate). This means that logic that relies on data or error being
cleared during a refetch will now behave differently. For example, placing an if condition that
checks if there is an error before a condition that checks for loading will now keep showing the
error during a refetch, instead of showing the loading spinner.
* **use-data-query:** There have been issues reported where yarn v1 had trouble installing the correct
babel dependencies. For the situations where that occured, deduplicating the yarn.lock resolved the
issue.
* **use-data-query:** There is a rare but unresolved issue where it's possible for the timing in tests
to behave differently from the timing in apps. This happens for tests that expect loading to be set
to true immediately after calling refetch. Changing such an assertion to an assertion that waits
for loading to eventually be true, i.e. @testing-library/react's waitFor(), resolves this issue.

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
