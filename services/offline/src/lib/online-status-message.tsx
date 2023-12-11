import React, { ReactElement, ReactNode, useContext, useState } from 'react'

type SetOnlineStatusMessage = (message: ReactNode) => void

// 'get' and 'set' contexts are separated so 'setter' consumers that don't
// actually need the value don't have to rerender when the value changes:
const OnlineStatusMessageValueContext = React.createContext<ReactNode>(null)
const SetOnlineStatusMessageContext =
    React.createContext<SetOnlineStatusMessage>(() => undefined)

export const OnlineStatusMessageProvider = ({
    children,
}: {
    children: ReactNode
}): ReactElement => {
    const [onlineStatusMessage, setOnlineStatusMessage] =
        useState<ReactNode>(null) // note: not undefined

    return (
        <OnlineStatusMessageValueContext.Provider value={onlineStatusMessage}>
            <SetOnlineStatusMessageContext.Provider
                value={setOnlineStatusMessage}
            >
                {children}
            </SetOnlineStatusMessageContext.Provider>
        </OnlineStatusMessageValueContext.Provider>
    )
}

export const useOnlineStatusMessageValue = () => {
    const onlineStatusMessage = useContext(OnlineStatusMessageValueContext)

    // note: value is initialized to `null` in provider, not undefined
    if (onlineStatusMessage === undefined) {
        throw new Error(
            'useOnlineStatusMessageValue must be used within an OnlineStatusMessageProvider'
        )
    }

    return onlineStatusMessage
}

export const useSetOnlineStatusMessage = () => {
    const setOnlineStatusMessage = useContext(SetOnlineStatusMessageContext)

    if (setOnlineStatusMessage === undefined) {
        throw new Error(
            'useSetOnlineStatusMessage must be used within an OnlineStatusMessageProvider'
        )
    }

    return setOnlineStatusMessage
}

// combination of both getter and setter (also provides backward compatability)
export const useOnlineStatusMessage = () => {
    const onlineStatusMessage = useOnlineStatusMessageValue()
    const setOnlineStatusMessage = useSetOnlineStatusMessage()

    return {
        onlineStatusMessage,
        setOnlineStatusMessage,
    }
}
