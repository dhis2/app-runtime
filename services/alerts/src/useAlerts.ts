import { useContext } from 'react'
import { AlertsContext } from './AlertsContext'

export const useAlerts = () => {
    return useContext(AlertsContext)
}
