import React, { ReactElement, useState } from 'react'
import { AlertsContext } from './AlertsContext'
import { AlertsManagerContext } from './AlertsManagerContext'
import { makeAlertsManager } from './makeAlertsManager'
import type { Alert, AlertsManager } from './types'

export const AlertsProvider = ({
    children,
}: {
    children: React.ReactNode
}): ReactElement => {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [alertsManager] = useState<AlertsManager>(() =>
        makeAlertsManager(setAlerts)
    )

    return (
        <AlertsManagerContext.Provider value={alertsManager}>
            <AlertsContext.Provider value={alerts}>
                {children}
            </AlertsContext.Provider>
        </AlertsManagerContext.Provider>
    )
}
