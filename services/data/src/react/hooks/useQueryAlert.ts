import { useAlert } from '@dhis2/app-service-alerts'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const noop = () => {
    /**
     * Used to silence the default react-query logger. Eventually we
     * could expose the setLogger functionality and remove the call
     * to setLogger here.
     */
}

export const useQueryAlert = (
    showAlert: boolean | string | ((props: any) => string),
    defaultMessage: string
): { show: (props: any) => void } => {
    const { show } = useAlert((props: any) => {
        if (typeof showAlert === 'boolean') {
            return defaultMessage
        } else if (typeof showAlert === 'function') {
            return showAlert(props)
        }
        return showAlert
    })

    if (!showAlert) {
        return { show: noop }
    }

    return { show }
}
