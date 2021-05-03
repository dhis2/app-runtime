# `useAlerts`

`useAlerts() → Alert[]`

## Usage note

The app-shell wraps the app in an `AlertsProvider` and also includes an `Alerts` component which leverages `useAlerts` to show `AlertBars` in an `AlertStack` (`@dhis2/ui` components). So in a typical DHIS2 app the only thing you need to use from the alerts-service is the `useAlert` hook.

## Alert

| Prop      | Type       | Description                                                                                                                                            |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `message` | `string`   | The alert message to display                                                                                                                           |
| `id`      | `number`   | Can be used as `key` when mapping over `alerts`                                                                                                        |
| `remove`  | `function` | Call this to remove the `alert`                                                                                                                        |
| `options` | `object`   | A configuration object that matches [the props](https://ui.dhis2.nu/#/api?id=coresrcalertbaralertbarproptypes-object) of the `AlertBar` in `@dhis2/ui` |

## Example

```js
export const Alerts = () => {
    const alerts = useAlerts()

    return alerts.map(alert => (
        <div key={alert.id}>
            {alert.message}
            <button onClick={alert.remove}>hide</button>
        </div>
    ))
}
```
