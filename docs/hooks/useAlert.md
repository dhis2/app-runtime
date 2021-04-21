# `useAlert`

`useAlert(message, options?) → { show, hide }`

## Hook arguments

| Name      | Type                   | Description                                                                                                                                                                                                                                                              |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `message` | `string` or `Function` | The message to display                                                                                                                                                                                                                                                   |
| `options` | `object` or `Function` | A configuration object that matches [the props of the `AlertBar`](https://ui.dhis2.nu/demo/?path=/docs/feedback-alerts-alert-bar--default) in `@dhis2/ui` (alternate: [minimal view](https://ui.dhis2.nu/#/api?id=coresrcalertbaralertbarproptypes-object) of the props) |

## Usage of the returned `show` function

`show(props?) → void`

When the `useAlert` hook receives the `message` argument as a `string` and the `options` argument as an `object`, the `show` function should be called without any arguments, for example:

```js
// Create the alert
const { show } = useAlert('My alert message', { duration: 3000 })
// ...later (show the alert)
show()
```

When providing functions as arguments to the `useAlert` hook, it's possible to pass arbitrary arguments to the `show` function to make a more dynamic alert, for example:

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

## Usage of the returned `hide` function

`hide() -> void`

When used in a "platform-app", or more generally, any app that uses the app-shell, this function will initiate the `hide` animation of the rendered `AlertBar` and once the animation completes, the alert will be removed from the alerts context.

When using the `@dhis2/app-service-alerts` independently, there are quite a few things to consider to achieve the desired behaviour:

-   The component used to display the alert must expose a `hide` method. For class components this means it needs to have implemented a public `hide` method. For function components the `hide` method needs to be exposed using the `useImperativeHandle` hook ([example](https://github.com/dhis2/ui/blob/master/packages/core/src/AlertBar/AlertBar.js#L58-L68)).
-   When rendering the alert-components, the `ref` from the `alert` (i.e. one of the alert items returned from `useAlerts`) needs to be forwarded to the ref of the alert-component ([example](https://github.com/dhis2/app-platform/blob/master/adapter/src/components/Alerts.js#L11-L33)).

## Note

The app-shell wraps the app in an `AlertsProvider` and also includes an `Alerts` component which leverages `useAlerts` to show `AlertBars` in an `AlertStack` (`@dhis2/ui` components). So in a typical DHIS2 app the only part needed from the alerts-service is the `useAlert` hook.
