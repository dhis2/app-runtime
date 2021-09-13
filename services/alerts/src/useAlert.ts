import { useContext, useRef, useCallback } from 'react'
import { AlertsManagerContext } from './AlertsManagerContext'
import type { AlertOptions, Alert, AlertsManager } from './types'

export const useAlert = (
    message: string | ((props: any) => string),
    options: AlertOptions | ((props: any) => AlertOptions) = {}
): { show: (props?: any) => void; hide: () => void } => {
    const { add }: AlertsManager = useContext(AlertsManagerContext)
    const alertRef = useRef(<Alert | null>null)

    const show = useCallback(
        (props?) => {
            const resolvedMessage = String(
                typeof message === 'function' ? message(props) : message
            )
            const resolvedOptions =
                typeof options === 'function' ? options(props) : options

            alertRef.current = add(
                {
                    message: resolvedMessage,
                    options: resolvedOptions,
                },
                alertRef
            )
        },
        [add, message, options]
    )

    const hide = useCallback(() => {
        alertRef.current?.remove?.()
    }, [])

    return {
        show,
        hide,
    }
}
