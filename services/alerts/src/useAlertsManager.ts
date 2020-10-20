import { useContext } from 'react'
import { AlertsManagerContext } from './AlertsManagerContext'

export const useAlertsManager = () => {
    return useContext(AlertsManagerContext)
}
