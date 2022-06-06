import { useDataQuery } from '@dhis2/app-service-data'
import PropTypes from 'prop-types'
import React from 'react'
import { useOfflineInterface } from './offline-interface'

/**
 * Provides a boolean indicating client's connection to the DHIS2 server,
 * which is different from connection to the internet.
 *
 * The context provider subscribes to messages from the SW tracking successes
 * and failures of requests to the DHIS2 server to determine connection status,
 * and then will initiate periodic pings if there are no incidental requests in
 * order to check the connection consistently
 */

interface Dhis2ConnectionStatusContextValue {
    isConnectedToDhis2: boolean
}

// todo: probably a better option; maybe make a server-health endpoint
const pingQuery = {
    ping: {
        resource: 'system/ping',
    },
}

const Dhis2ConnectionStatusContext = React.createContext({
    isConnectedToDhis2: false,
})

export const Dhis2ConnectionStatusProvider = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    // todo: what boolean should isConnected initialize to?
    const [isConnected, setIsConnected] = React.useState(false)
    const offlineInterface = useOfflineInterface()
    const { refetch: ping } = useDataQuery(pingQuery, { lazy: true })
    const pingTimeoutRef = React.useRef((null as unknown) as NodeJS.Timeout) // silly types juggling

    // A timeout is used instead of an interval for handling slow execution
    // https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency
    // After this executes, the 'onStatusChange' callback should start the timer again
    function startPingTimer() {
        clearTimeout(pingTimeoutRef.current)
        pingTimeoutRef.current = setTimeout(() => {
            ping()
        }, 30 * 1000) // todo: examine time
    }

    function onStatusChange({
        isConnectedToDhis2,
    }: Dhis2ConnectionStatusContextValue) {
        setIsConnected(isConnectedToDhis2)
        startPingTimer()
    }

    React.useEffect(() => {
        if (!pingTimeoutRef.current) {
            startPingTimer()
        }

        const unsubscribe = offlineInterface.subscribeToDhis2ConnectionStatus({
            onChange: onStatusChange,
        })

        return () => {
            unsubscribe()
            clearTimeout(pingTimeoutRef.current)
        }
    }, [offlineInterface]) // eslint-disable-line react-hooks/exhaustive-deps

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
