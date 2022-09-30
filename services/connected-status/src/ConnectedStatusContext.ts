import React from 'react'
import { ConnectedStatusContextAPI } from './types'

export const defaultConnectedStatus = { status: 'disconnected' }

const defaultApi: ConnectedStatusContextAPI = {
    connectionStatus: defaultConnectedStatus,
    setConnectedStatus: () => undefined,
}

export const ConnectedStatusContext =
    React.createContext<ConnectedStatusContextAPI>(defaultApi)
