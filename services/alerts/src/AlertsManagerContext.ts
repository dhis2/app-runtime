import React from 'react'
import type { AlertsManager } from './types'

const defaultAlertsManager: AlertsManager = {
    add: () => undefined,
}

export const AlertsManagerContext = React.createContext<AlertsManager>(
    defaultAlertsManager
)
