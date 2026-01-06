# CurrentUser Type

The `CurrentUser` type is returned by the [useCurrentUserInfo](../hooks/useCurrentUserInfo.md) hook, and represents the current authenticated DHIS2 user.

|            Property            |     Type      | Description                                    |
| :----------------------------: | :-----------: | ---------------------------------------------- |
|             **id**             |    string     | Unique user identifier.                        |
|          **username**          |    string     | Username used to log in.                       |
|        **displayName**         |    string     | Full display name of the user.                 |
|        **authorities**         |   string[]    | List of user authority codes.                  |
|     **organisationUnits**      | Array\<\{id}>  | Organisation units assigned to the user.       |
|            **name**            |    string?    | User's full name (optional).                   |
|          **surname**           |    string?    | User's surname (optional).                     |
|         **firstName**          |    string?    | User's first name (optional).                  |
|           **email**            |    string?    | User email address.                            |
|       **emailVerified**        |   boolean?    | Indicates if the email is verified.            |
|        **introduction**        |    string?    | Short profile introduction.                    |
|          **birthday**          |    string?    | User's date of birth.                          |
|        **nationality**         |    string?    | User’s nationality.                            |
|         **education**          |    string?    | User’s education background.                   |
|         **interests**          |    string?    | User’s interests.                              |
|          **whatsApp**          |    string?    | WhatsApp contact.                              |
|     **facebookMessenger**      |    string?    | Facebook Messenger contact.                    |
|           **skype**            |    string?    | Skype contact.                                 |
|          **telegram**          |    string?    | Telegram contact.                              |
|          **twitter**           |    string?    | Twitter handle.                                |
|          **employer**          |    string?    | Name of the employer.                          |
|         **languages**          |    string?    | Spoken languages.                              |
|           **gender**           |    string?    | Gender of the user.                            |
|          **jobTitle**          |    string?    | User’s job title.                              |
|          **created**           |    string?    | ISO timestamp when the user was created.       |
|        **lastUpdated**         |    string?    | ISO timestamp of last update.                  |
|           **access**           |    object?    | Access permissions for the user.               |
|          **settings**          |    object?    | User interface and system preference settings. |
|         **userGroups**         | Array\<\{id}>? | Groups the user belongs to.                    |
|         **userRoles**          | Array\<\{id}>? | User roles assigned.                           |
| **dataViewOrganisationUnits**  | Array\<\{id}>? | Org units allowed for data view access.        |
| **teiSearchOrganisationUnits** | Array\<\{id}>? | Org units used for TEI searching.              |
|          **programs**          |   string[]?   | Programs assigned to the user.                 |
|          **dataSets**          |   string[]?   | Data sets the user has access to.              |
|         **patTokens**          | Array\<\{id}>? | Personal access tokens.                        |
|      **attributeValues**       |    any[]?     | Additional attribute values.                   |
|         **favorites**          |    any[]?     | User favorites stored in DHIS2.                |
|        **translations**        |    any[]?     | Translated fields for the user.                |
|       **twoFactorType**        |    string?    | Type of two-factor authentication enabled.     |
