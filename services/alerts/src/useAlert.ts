import { useCallback, useContext, useEffect, useState } from 'react'
import { AlertsManagerContext } from './AlertsManagerContext'
import { Alert, AlertOptions } from './types'

const defaultOptions: AlertOptions = {
    duration: 3000,
}

export const useAlert = (
    message: string | ((props: any) => string),
    options?: AlertOptions | ((props: any) => AlertOptions)
) => {
    const alertsManager = useContext(AlertsManagerContext)
    const [shownAlerts] = useState(new Map<Alert, number>())

    const show = useCallback(
        props => {
            const resolvedMessage =
                typeof message === 'function' ? message(props) : String(message)
            const resolvedOptions = {
                ...defaultOptions,
                ...(typeof options === 'function' ? options(props) : options),
            }
            const alert = {
                message: resolvedMessage,
                options: resolvedOptions,
            }
            const timeout = setTimeout(() => {
                alertsManager.hide(alert)
                shownAlerts.delete(alert)
            }, resolvedOptions.duration)

            shownAlerts.set(alert, timeout)

            alertsManager.show(alert)
        },
        [alertsManager, message, options, shownAlerts]
    )

    const hideAll = useCallback(() => {
        shownAlerts.forEach((timeout, alert) => {
            alertsManager.hide(alert)
            clearTimeout(timeout)
        })
    }, [alertsManager, shownAlerts])

    useEffect(() => {
        return () => {
            hideAll()
        }
    }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

    return { show, hideAll }
}
