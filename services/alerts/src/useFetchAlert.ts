import { useAlert } from './useAlert'

const useFetchAlert = (): {
    showSuccess: (message: string) => void
    showError: (message: string) => void
    hide: () => void
} => {
    const { show, hide } = useAlert(
        ({ message }) => message,
        ({ isError }) => (isError ? { critical: true } : { success: true })
    )
    return {
        showSuccess: (message: string) => show({ message }),
        showError: (message: string) => show({ message, isError: true }),
        hide: hide,
    }
}

export { useFetchAlert }
