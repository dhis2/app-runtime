# `useAlert`

`useAlert(message, options?) → { show }`

## Hook arguments

| Name      | Type                   | Description                                                                                                                                            |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `message` | `string` or `Function` | The message to display                                                                                                                                 |
| `options` | `object` or `Function` | A configuration object that matches [the props](https://ui.dhis2.nu/#/api?id=coresrcalertbaralertbarproptypes-object) of the `AlertBar` in `@dhis2/ui` |

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

## Usage note

The app-shell wraps the app in an `AlertsProvider` and also includes an `Alerts` component which leverages `useAlerts` to show `AlertBars` in an `AlertStack` (`@dhis2/ui` components). So in a typical DHIS2 app the only thing you need to use from the alerts-service is the `useAlert` hook.
