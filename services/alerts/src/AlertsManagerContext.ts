import React from 'react'
import { AlertsManager } from './types'

const noop = () => {
    /* Do nothing */
}

const defaultAlertsManager: AlertsManager = { remove: noop, add: noop }

export const AlertsManagerContext = React.createContext<AlertsManager>(
    defaultAlertsManager
)
