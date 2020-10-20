import React from 'react'
import { Alert, AlertsManager } from './types'

type SetAlertsFunction = React.Dispatch<React.SetStateAction<Alert[]>>

export const makeAlertManager = (
    setAlerts: SetAlertsFunction
): AlertsManager => {
    const hide = (alert: Alert) => {
        setAlerts(alerts => {
            const idx = alerts.findIndex(a => a === alert)
            console.log('HIDE', alert, alerts, idx)
            if (idx === -1) return alerts
            return [
                ...alerts.slice(0, idx),
                ...alerts.slice(idx + 1, alerts.length),
            ]
        })
    }
    const show = (alert: Alert) => {
        setAlerts(alerts => {
            console.log('show', alert, alerts)
            if (alerts.find(a => a === alert)) {
                console.log('found :-(')
                return alerts
            }
            return [...alerts, alert]
        })
    }

    return {
        show,
        hide,
    }
}

const defaultAlertsManager: AlertsManager = {
    show: (alert: Alert) => {
        console.log('ALERT', alert.message)
    },
    hide: () => {
        /* Do nothing */
    },
}

export const AlertsManagerContext = React.createContext<AlertsManager>(
    defaultAlertsManager
)
