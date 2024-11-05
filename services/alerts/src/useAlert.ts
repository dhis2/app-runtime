import { useContext, useRef, useCallback } from 'react'
import { AlertsManagerContext } from './AlertsManagerContext'
import type { AlertOptions, Alert, AlertsManager } from './types'

export const useAlert = (
    message: string | ((props: any) => string),
    options: AlertOptions | ((props: any) => AlertOptions) = {}
): { show: (props?: any) => void; hide: () => void } => {
    const { add, plugin, parentAlertsAdd, showAlertsInPlugin }: AlertsManager =
        useContext(AlertsManagerContext)
    const alertRef = useRef(<Alert | null>null)

    const show = useCallback(
        (props?: any) => {
            const resolvedMessage = String(
                typeof message === 'function' ? message(props) : message
            )
            const resolvedOptions =
                typeof options === 'function' ? options(props) : options

            if (plugin && parentAlertsAdd && !showAlertsInPlugin) {
                alertRef.current = parentAlertsAdd(
                    {
                        message: resolvedMessage,
                        options: resolvedOptions,
                    },
                    alertRef
                )
            } else {
                alertRef.current = add(
                    {
                        message: resolvedMessage,
                        options: resolvedOptions,
                    },
                    alertRef
                )
            }
        },
        [add, parentAlertsAdd, message, options, plugin, showAlertsInPlugin]
    )

    const hide = useCallback(() => {
        alertRef.current?.remove?.()
    }, [])

    return {
        show,
        hide,
    }
}
