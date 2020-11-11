import { useContext } from 'react'
import { AlertsManagerContext } from './AlertsManagerContext'
import { Alert, AlertOptions } from './types'

export const useAlert = (
    message: string | ((props: any) => string),
    options: AlertOptions | ((props: any) => AlertOptions) = {}
) => {
    const alertsManager = useContext(AlertsManagerContext)

    const show = (props?: any) => {
        const resolvedMessage = String(
            typeof message === 'function' ? message(props) : message
        )
        const resolvedOptions =
            typeof options === 'function' ? options(props) : options

        const alert: Alert = {
            message: resolvedMessage,
            options: resolvedOptions,
        }

        alertsManager.add(alert)
    }

    return { show }
}
