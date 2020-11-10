type AlertAction = {
    label: string
    onClick: () => void
}
export type AlertOptions = {
    actions?: AlertAction[]
    className?: string
    critical?: boolean
    dataTest?: string
    duration?: number
    icon?: boolean | React.ElementType
    permanent?: boolean
    success?: boolean
    warning?: boolean
    onHidden?: () => void
}

export interface AlertsManager {
    add: (alert: Alert) => void
    remove: (id: number) => void
}

export type Alert = {
    message: string
    options: AlertOptions
}

export interface AlertsManagerAlert extends Alert {
    id: number
    remove: () => void
}
