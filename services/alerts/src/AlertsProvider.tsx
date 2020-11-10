import React, { useState, useMemo } from 'react'
import { AlertsContext } from './AlertsContext'
import { AlertsManagerContext, makeAlertsManager } from './AlertsManagerContext'
import { Alert, AlertsManager } from './types'

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const alertsManager: AlertsManager = useMemo(
        () => makeAlertsManager(setAlerts),
        []
    )

    return (
        <AlertsManagerContext.Provider value={alertsManager}>
            <AlertsContext.Provider value={alerts}>
                {children}
            </AlertsContext.Provider>
        </AlertsManagerContext.Provider>
    )
}
