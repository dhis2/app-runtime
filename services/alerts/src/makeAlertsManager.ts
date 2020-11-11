import { Alert, AlertsManager, AlertsManagerAlert } from './types'

type SetAlertsFunction = React.Dispatch<
    React.SetStateAction<AlertsManagerAlert[]>
>

const createAlertManagerAlert = (
    alert: Alert,
    id: number,
    remove: (id: number) => void
): AlertsManagerAlert => ({
    ...alert,
    id,
    remove: () => remove(id),
})

export const makeAlertsManager = (
    setAlerts: SetAlertsFunction
): AlertsManager => {
    let id = 0

    const remove = (id: number) => {
        setAlerts(alerts => alerts.filter(alert => alert.id !== id))
    }
    const add = (alert: Alert) => {
        setAlerts(alerts => [
            ...alerts,
            createAlertManagerAlert(alert, ++id, remove),
        ])
    }

    return {
        remove,
        add,
    }
}
