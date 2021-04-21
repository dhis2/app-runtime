import type { Alert, AlertRef, AlertsManager, AlertsMap } from './types'

const toVisibleAlertsArray = (alertsMap: AlertsMap) =>
    Array.from(alertsMap.values()).sort(
        (a, b) => (a.id as number) - (b.id as number)
    )

export const makeAlertsManager = (
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
): AlertsManager => {
    const alertsMap: AlertsMap = new Map()
    let id = 0

    const add = (alert: Alert, alertRef: AlertRef) => {
        if (!alert.id) {
            id++
        }

        const alertId = alert.id || id
        const alertsMapAlert = {
            ...alert,
            id: alertId,
            remove: () => {
                alertsMap.delete(alertId)
                alertRef.current = null
                setAlerts(toVisibleAlertsArray(alertsMap))
            },
        }

        alertsMap.set(alertsMapAlert.id, alertsMapAlert)
        setAlerts(toVisibleAlertsArray(alertsMap))

        return alertsMapAlert
    }

    return {
        add,
    }
}
