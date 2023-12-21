import React, { ReactElement, ReactNode, useContext, useState } from 'react'

type SetOnlineStatusMessage = (message: ReactNode) => void

// 'get' and 'set' contexts are separated so 'setter' consumers that don't
// actually need the value don't have to rerender when the value changes:
const OnlineStatusMessageValueContext =
    React.createContext<ReactNode>(undefined)
const SetOnlineStatusMessageContext =
    React.createContext<SetOnlineStatusMessage>(() => undefined)

export const OnlineStatusMessageProvider = ({
    children,
}: {
    children: ReactNode
}): ReactElement => {
    const [onlineStatusMessage, setOnlineStatusMessage] = useState<ReactNode>() // note: not undefined

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
    return useContext(OnlineStatusMessageValueContext)
}

export const useSetOnlineStatusMessage = () => {
    return useContext(SetOnlineStatusMessageContext)
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
