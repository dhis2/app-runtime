import type { Alert, AlertRef, AlertsManager, AlertsMap } from './types'

const toVisibleAlertsArray = (alertsMap: AlertsMap) =>
    Array.from(alertsMap.values()).sort(
        (a, b) => (a.id as number) - (b.id as number)
    )

const createRemoveFactory = (
    alertsMap: AlertsMap,
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
) => (id: number, alertRef: AlertRef) => () => {
    alertsMap.delete(id)
    alertRef.current = null
    setAlerts(toVisibleAlertsArray(alertsMap))
}

export const makeAlertsManager = (
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
): AlertsManager => {
    const alertsMap: AlertsMap = new Map()
    let id = 0
    const createRemove = createRemoveFactory(alertsMap, setAlerts)

    const add = (alert: Alert, alertRef: AlertRef) => {
        id++

        if (alert.id) {
            // clear the old version of this alert to avoid duplication
            alertsMap.delete(alert.id)
        }

        const alertsMapAlert = {
            ...alert,
            id,
            remove: createRemove(id, alertRef),
        }

        alertsMap.set(alertsMapAlert.id, alertsMapAlert)
        setAlerts(toVisibleAlertsArray(alertsMap))

        return alertsMapAlert
    }

    return {
        add,
    }
}
