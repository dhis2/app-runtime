# useAlert Hook

## Basic Usage:

```js
import { useAlert } from '@dhis2/app-runtime'

// Within a functional component body
const { show } = useAlert(message, options)
```

## Input

| Name    | Type                   | Required     | Description                                                                                                             |
| ------- | ---------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| message | _string_ or _function_ | **required** | The message to display                                                                                                  |
| options | _object_ or _function_ |              | A configuration object that matches [the props of the `AlertBar`](https://ui.dhis2.nu/#/api?id=alertbar) in `@dhis2/ui` |

## Output

| Name | Type       | Description                                            |
| ---- | ---------- | ------------------------------------------------------ |
| show | _function_ | A new alert is shown each time this function is called |

## Usage of the returned `show` function

`show(props?) → void`

When the `useAlert` hook receives the `message` argument as a `string` and the `options` argument as an `object`, the `show` function should be called without any arguments, for example:

```js
// Create the alert
const { show } = useAlert('My alert message', { duration: 3000 })
// ...later (show the alert)
show()
```

When providing functions as arguments to the `useAlert` hook, you can pass arbitrary arguments to the `show` function to make a more dynamic alert, for example:

```js
// Create the alert
const { show } = useAlert(
    ({ username }) => `Successfully deleted ${username}`,
    ({ isCurrentUser }) =>
        isCurrentUser ? { critical: true } : { success: true }
)
// ...later (show the alert)
show({ username: 'hendrik', isCurrentUser: true })

// message: "Successfully deleted hendrik"
// options: { critical: true }
```

The two approaches can also be combined, i.e. having a static `message` and dynamic `options` or vice versa.

## Example

```jsx
import React from 'react'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'

const mutation = {
    resource: 'mutation',
    type: 'create',
}

const MyComponent = () => {
    const successAlert = useAlert('Mutation succeeded', { success: true })
    const errorAlert = useAlert(({ error }) => `Mutation error: ${error}`, {
        critical: true,
    })

    const [mutate] = useDataMutation(mutation, {
        onComplete() {
            successAlert.show()
        },
        onError(error) {
            errorAlert.show({ error: error.message })
        },
    })

    return <Button onClick={mutate}>Trigger mutation</Button>
}
```

## Usage note

The app-shell wraps the app in an `AlertsProvider` and also includes an `Alerts` component which leverages `useAlerts` to show `AlertBars` in an `AlertStack` (`@dhis2/ui` components). So in a typical DHIS2 app the only thing you need to use from the alerts-service is the `useAlert` hook.
