import React from 'react'
import type { AlertsManager } from './types'

const placeholder = () => {
    throw new Error(
        'This function is a placeholder used when creating the AlertsManagerContext, it should be overridden'
    )
}

const defaultAlertsManager: AlertsManager = {
    add: placeholder,
}

export const AlertsManagerContext =
    React.createContext<AlertsManager>(defaultAlertsManager)
