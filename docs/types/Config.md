# Config Type

The Application Config type is a required input to the top-level
[Provider](../provider.md), and can be accessed from within an application
with the [useConfig](../hooks/useConfig.md) hook.

|     Property      |     Type     | Required | Description                                                              |
| :---------------: | :----------: | :------: | ------------------------------------------------------------------------ |
|    **baseUrl**    |   _string_   |   yes    | The base URL of the DHIS2 Core server, i.e. `https://play.dhis2.org/dev` |
|    **appName**    |   _string_   |    no    | The name of the application                                              |
|  **appVersion**   |  _Version_   |    no    | The version of the application                                           |
| **serverVersion** |  _Version_   |    no    | The DHIS2 server version object                                          |
|  **systemInfo**   | _SystemInfo_ |    no    | Information about the DHIS2 server                                       |

### Version

| Property  |   Type   | Required | Description                                |
| :-------: | :------: | :------: | ------------------------------------------ |
| **full**  | _string_ |   yes    | The full version string, e.g. `2.40.0`     |
| **major** | _number_ |   yes    | The major version number                   |
| **minor** | _number_ |   yes    | The minor version number                   |
| **patch** | _number_ |    no    | The patch version number                   |
|  **tag**  | _string_ |    no    | An additional version tag, e.g. `SNAPSHOT` |

### SystemInfo

|       Property       |   Type   | Required | Description                     |
| :------------------: | :------: | :------: | ------------------------------- |
|     **version**      | _string_ |   yes    | The DHIS2 server version string |
|   **contextPath**    | _string_ |   yes    | The root path to application    |
| **serverTimeZoneId** | _string_ |   yes    | The time zone ID of the server  |
