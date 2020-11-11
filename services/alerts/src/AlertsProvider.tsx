import React, { useState } from 'react'
import { AlertsContext } from './AlertsContext'
import { AlertsManagerContext } from './AlertsManagerContext'
import { makeAlertsManager } from './makeAlertsManager'
import { AlertsManagerAlert, AlertsManager } from './types'

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<AlertsManagerAlert[]>([])
    const [alertsManager] = useState<AlertsManager>(
        (): AlertsManager => makeAlertsManager(setAlerts)
    )

    return (
        <AlertsManagerContext.Provider value={alertsManager}>
            <AlertsContext.Provider value={alerts}>
                {children}
            </AlertsContext.Provider>
        </AlertsManagerContext.Provider>
    )
}
