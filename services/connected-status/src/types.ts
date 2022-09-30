import { ReactNode } from 'react'

export enum ConnectionStatus {
    connected = 'connected',
    disconnected = 'disconnected',
    reconnecting = 'reconnecting',
    syncing = 'syncing',
}

export type ConnectionInfo = {
    status: string
    message?: ReactNode
}

export type ConnectionInfoUpdate = Partial<ConnectionInfo>

export type UpdateConnectedStatus = (update: ConnectionInfoUpdate) => void

export type SetConnectedInfo = (update: ConnectionInfo) => void

export type ConnectedStatusContextAPI = {
    connectionStatus: ConnectionInfo
    setConnectedStatus: SetConnectedInfo
}

export type UseConnectedStatusHook = () => {
    connectionStatus: ConnectionInfo
    updateConnectedStatus: UpdateConnectedStatus
}
