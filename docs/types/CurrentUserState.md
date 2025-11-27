# CurrentUserState Type

The `CurrentUserState` type is returned by the [useCurrentUserInfo](../hooks/useCurrentUserInfo.md) hook, and represents the current authenticated DHIS2 user along with loading and error state information.

|   Property   |        Type         | Description                                                                                       |
| :----------: | :----------------: | ------------------------------------------------------------------------------------------------- |
|    **user**  | _CurrentUser_ \| undefined | The current authenticated DHIS2 user, or `undefined` if the user has not yet been loaded         |
|  **loading** | _boolean_          | `true` if the user information is still being loaded; `false` otherwise                           |
|   **error**  | _Error_ \| undefined | An error object if the fetch failed, otherwise `undefined`                                       |
|  **refetch** | _() => void_       | Function to manually re-fetch the user information                       |
