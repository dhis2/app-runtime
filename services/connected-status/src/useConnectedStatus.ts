import { useContext } from 'react'
import { ConnectedStatusContext } from './ConnectedStatusContext'
import {
    ConnectedStatusContextAPI,
    ConnectionInfoUpdate,
    UseConnectedStatusHook,
    ConnectionStatus,
} from './types'

const checkConnectedStatusUpdate = (update: ConnectionInfoUpdate) => {
    if (
        'status' in update &&
        !Object.values(ConnectionStatus).includes(
            update.status as ConnectionStatus
        )
    ) {
        throw new Error(
            `connected status can only be set to one of: ${Object.values(
                ConnectionStatus
            )}`
        )
    }
}

export const useConnectedStatus: UseConnectedStatusHook = () => {
    const { connectionStatus, setConnectedStatus } =
        useContext<ConnectedStatusContextAPI>(ConnectedStatusContext)

    return {
        connectionStatus,
        updateConnectedStatus: (update) => {
            checkConnectedStatusUpdate(update)

            return setConnectedStatus({
                ...connectionStatus,
                ...update,
            })
        },
    }
}
