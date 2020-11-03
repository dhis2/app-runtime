import React from 'react'
import { Alert, AlertsManager, AlertsManagerAlert } from './types'

type SetAlertsFunction = React.Dispatch<React.SetStateAction<Alert[]>>

export const makeAlertManager = (
    setAlerts: SetAlertsFunction
): AlertsManager => {
    let id = 0

    const hide = (alert: Alert) => {
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
    const show = (alert: Alert) => {
        setAlerts(alerts => {
            if (alerts.some(a => a === alert)) {
                return alerts
            }

            id++

            const alertManagerAlert: AlertsManagerAlert = {
                ...alert,
                id,
                get hide() {
                    return () => hide(this)
                },
            }

            return [...alerts, alertManagerAlert]
        })
    }

    return {
        show,
        hide,
    }
}

const noop = () => {
    /* Do nothing */
}

const defaultAlertsManager: AlertsManager = { show: noop, hide: noop }

export const AlertsManagerContext = React.createContext<AlertsManager>(
    defaultAlertsManager
)
