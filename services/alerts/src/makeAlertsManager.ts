import type { Alert, AlertRef, AlertsManager, AlertsMap } from './types'

const toVisibleAlertsArray = (alertsMap: AlertsMap) =>
    Array.from(alertsMap.values())

export const makeAlertsManager = (
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>,
    plugin: boolean
): AlertsManager => {
    const alertsMap: AlertsMap = new Map()
    let id = 0

    const add = (alert: Alert, alertRef: AlertRef) => {
        const alertId = alertRef.current?.id ?? ++id
        const alertsMapAlert = {
            ...alert,
            id: alertId,
            remove: () => {
                alertsMap.delete(alertId)
                alertRef.current = null
                setAlerts(toVisibleAlertsArray(alertsMap))
            },
        }

        alertsMap.set(alertId, alertsMapAlert)
        setAlerts(toVisibleAlertsArray(alertsMap))

        return alertsMapAlert
    }

    return {
        add,
        plugin,
    }
}
