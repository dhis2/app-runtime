import { MutableRefObject } from 'react'

export type AlertOptions = Record<string, unknown>

export type Alert = {
    id?: number
    remove?: () => void
    message: string
    options: AlertOptions
}

export type AlertRef = MutableRefObject<Alert | null>

export type AlertsMap = Map<number, Alert>

export type AlertsManager = {
    add: (alert: Alert, alertRef: AlertRef) => Alert
}
