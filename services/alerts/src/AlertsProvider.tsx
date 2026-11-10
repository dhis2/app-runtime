import React, { ReactElement, useMemo, useState } from 'react'
import { AlertsContext } from './AlertsContext'
import { AlertsManagerContext } from './AlertsManagerContext'
import { makeAlertsManager } from './makeAlertsManager'
import type { Alert, AlertsManager } from './types'

export const AlertsProvider = ({
    plugin = false,
    parentAlertsAdd,
    showAlertsInPlugin = false,
    children,
}: {
    plugin?: boolean
    parentAlertsAdd?: any
    showAlertsInPlugin?: boolean
    children: React.ReactNode
}): ReactElement => {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [alertsManager] = useState<AlertsManager>(() =>
        makeAlertsManager(setAlerts, plugin)
    )
    // Memoized so useAlert consumers don't re-render whenever alerts change
    const alertsManagerValue = useMemo(
        () => ({ ...alertsManager, parentAlertsAdd, showAlertsInPlugin }),
        [alertsManager, parentAlertsAdd, showAlertsInPlugin]
    )

    return (
        <AlertsManagerContext.Provider value={alertsManagerValue}>
            <AlertsContext.Provider value={alerts}>
                {children}
            </AlertsContext.Provider>
        </AlertsManagerContext.Provider>
    )
}
