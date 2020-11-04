import React from 'react'
import { Alert, AlertsManager, AlertsManagerAlert } from './types'

type SetAlertsFunction = React.Dispatch<React.SetStateAction<Alert[]>>

export const makeAlertManager = (
    setAlerts: SetAlertsFunction
): AlertsManager => {
    let id = 0

    const remove = (alert: Alert) => {
        setAlerts(alerts => {
            const idx = alerts.findIndex(a => a === alert)

            if (idx === -1) {
                return alerts
            }

            return [
                ...alerts.slice(0, idx),
                ...alerts.slice(idx + 1, alerts.length),
            ]
        })
    }
    const add = (alert: Alert) => {
        setAlerts(alerts => {
            if (alerts.some(a => a === alert)) {
                return alerts
            }

            id++

            const alertManagerAlert: AlertsManagerAlert = {
                ...alert,
                id,
                get remove() {
                    return () => {
                        alert.options.onHidden && alert.options.onHidden()
                        remove(this)
                    }
                },
            }

            return [...alerts, alertManagerAlert]
        })
    }

    return {
        remove,
        add,
    }
}

const noop = () => {
    /* Do nothing */
}

const defaultAlertsManager: AlertsManager = { remove: noop, add: noop }

export const AlertsManagerContext = React.createContext<AlertsManager>(
    defaultAlertsManager
)
