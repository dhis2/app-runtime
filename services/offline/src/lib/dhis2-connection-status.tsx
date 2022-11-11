import { useDataQuery } from '@dhis2/app-service-data'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useOfflineInterface } from './offline-interface'
import useSmartIntervals from './use-progressive-interval'

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

// todo: maybe make a server-health endpoint
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
    const [isConnected, setIsConnected] = React.useState(true)
    const offlineInterface = useOfflineInterface()
    const { refetch: ping } = useDataQuery(pingQuery, { lazy: true })
    const { pause, resume, snooze, resetBackoff } = useSmartIntervals({
        // not perfect, but there's no 'window.focused' variable:
        initialPauseValue: document.visibilityState === 'visible',
        callback: ping as any,
    })

    const handleChange = useCallback(
        ({ isConnectedToDhis2: newStatus }) => {
            // If value changed, set ping interval back to initial
            if (newStatus !== isConnected) {
                resetBackoff()
                setIsConnected(newStatus)
            }
            // Either way, snooze ping timer
            snooze()
        },
        [isConnected, resetBackoff, snooze]
    )
    const handleBlur = () => {
        pause()
    }
    const handleFocus = () => {
        resume()
    }

    React.useEffect(() => {
        const unsubscribe = offlineInterface.subscribeToDhis2ConnectionStatus({
            onChange: handleChange,
        })

        window.addEventListener('blur', handleBlur)
        window.addEventListener('focus', handleFocus)

        return () => {
            unsubscribe()
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('focus', handleFocus)
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

export const useDhis2ConnectionStatus =
    (): Dhis2ConnectionStatusContextValue => {
        const context = React.useContext(Dhis2ConnectionStatusContext)

        if (!context) {
            throw new Error(
                'useDhis2ConnectionStatus must be used within a Dhis2ConnectionStatus provider'
            )
        }

        return context
    }
