type AlertAction = {
    label: string
    onClick: () => void
}
export type AlertOptions = {
    type?: 'critical' | 'warning' | 'success'
    actions?: AlertAction[]
    duration?: number
    icon?: boolean | React.ElementType
    permanent?: boolean
    onHidden?: () => void
}

export interface AlertsManager {
    show: (alert: Alert) => void
    hide: (alert: Alert) => void
}

export type Alert = {
    message: string
    options: AlertOptions
}
