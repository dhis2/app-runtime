import React from 'react'
import { Alert, AlertsManager, AlertsManagerAlert } from './types'

type SetAlertsFunction = React.Dispatch<
    React.SetStateAction<AlertsManagerAlert[]>
>

export const makeAlertsManager = (
    setAlerts: SetAlertsFunction
): AlertsManager => {
    let id = 0

    const remove = (id: number) => {
        setAlerts((alerts: AlertsManagerAlert[]) =>
            alerts.filter(alert => alert.id !== id)
        )
    }
    const add = (alert: Alert) => {
        setAlerts(alerts => {
            id++

            const alertManagerAlert: AlertsManagerAlert = {
                ...alert,
                id,
                remove: () => remove(id),
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
