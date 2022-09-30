import React, { ReactElement, useState } from 'react'
import {
    ConnectedStatusContext,
    defaultConnectedStatus,
} from './ConnectedStatusContext'
import { ConnectionInfo } from './types'

export const ConnectedStatusProvider = ({
    children,
}: {
    children: React.ReactNode
}): ReactElement => {
    const [connectionStatus, setConnectedStatus] = useState<ConnectionInfo>(
        defaultConnectedStatus
    )

    return (
        <ConnectedStatusContext.Provider
            value={{ connectionStatus, setConnectedStatus }}
        >
            {children}
        </ConnectedStatusContext.Provider>
    )
}
