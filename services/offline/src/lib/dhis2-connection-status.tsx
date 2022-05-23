import PropTypes from 'prop-types'
import React from 'react'
import { useOfflineInterface } from './offline-interface.js'

interface Dhis2ConnectionStatusContextValue {
    isConnectedToDhis2: boolean
}

const Dhis2ConnectionStatusContext = React.createContext({
    isConnectedToDhis2: false,
})

export const Dhis2ConnectionStatusProvider = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    // todo: what should this value initialize to?
    const [isConnected, setIsConnected] = React.useState(false)
    const offlineInterface = useOfflineInterface()

    React.useEffect(() => {
        const unsubscribe = offlineInterface.subscribeToDhis2ConnectionStatus({
            onChange: ({
                isConnectedToDhis2,
            }: Dhis2ConnectionStatusContextValue) => {
                setIsConnected(isConnectedToDhis2)
            },
        })
        return unsubscribe
    }, [offlineInterface])

    return (
        <Dhis2ConnectionStatusContext.Provider
            value={{ isConnectedToDhis2: isConnected }}
        >
            {children}
        </Dhis2ConnectionStatusContext.Provider>
    )
}
Dhis2ConnectionStatusProvider.propTypes = {
    children: PropTypes.node,
}

export const useDhis2ConnectionStatus = (): Dhis2ConnectionStatusContextValue => {
    const context = React.useContext(Dhis2ConnectionStatusContext)

    if (!context) {
        throw new Error(
            'useDhis2ConnectionStatus must be used within a Dhis2ConnectionStatus provider'
        )
    }

    return context
}
