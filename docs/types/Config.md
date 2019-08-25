# Config Type

The Application Config type is a required input to the top-level [Provider](provider), and can be accessed from within an application with the [useConfig](hooks/useConfig) hook.

| Property | Type | Description |
|:--------:|:----:|-------------|
| **baseUrl** | *string* | The base URL of the DHIS2 Core server, i.e. `https://play.dhis2.org/dev` |
| **apiVersion** | *number* | The default API version to use.  API request resource paths will be expanded to `{baseUrl}/api/{version}/{path}` |