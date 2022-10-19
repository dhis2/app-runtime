import React, { ReactElement, ReactNode, useContext, useState } from 'react'
import { OnlineStatusMessageContextAPI } from '../types'

const defaultApi: OnlineStatusMessageContextAPI = {
    onlineStatusMessage: undefined,
    setOnlineStatusMessage: () => undefined,
}

const OnlineStatusMessageContext =
    React.createContext<OnlineStatusMessageContextAPI>(defaultApi)

export const useOnlineStatusMessage = (): OnlineStatusMessageContextAPI => {
    const { onlineStatusMessage, setOnlineStatusMessage } =
        useContext<OnlineStatusMessageContextAPI>(OnlineStatusMessageContext)

    return {
        onlineStatusMessage,
        setOnlineStatusMessage,
    }
}

export const OnlineStatusMessageProvider = ({
    children,
}: {
    children: ReactNode
}): ReactElement => {
    const [onlineStatusMessage, setOnlineStatusMessage] = useState<ReactNode>()

    return (
        <OnlineStatusMessageContext.Provider
            value={{
                onlineStatusMessage,
                setOnlineStatusMessage,
            }}
        >
            {children}
        </OnlineStatusMessageContext.Provider>
    )
}
