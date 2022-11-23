import { useDataEngine } from '@dhis2/app-service-data'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useOfflineInterface } from './offline-interface'
import SmartInterval from './smart-interval'

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
    const engine = useDataEngine()

    const smartIntervalRef = React.useRef(null as null | SmartInterval)

    const ping = useCallback(() => {
        engine.query(pingQuery).catch((err) => {
            if (/Unexpected token 'p'/.test(err.message)) {
                // Everything's fine; this is just a weird endpoint
                // ('"pong" is not valid JSON')
                // todo: maybe change link handling of this endpoint
                return
            }

            if (/An unknown network error occurred/.test(err.message)) {
                // This shouldn't normally occur if the service worker is
                // active. Still, update connected status accordingly and
                // reset interval backoff
                if (isConnected) {
                    console.log('status changed; resetting backoff')

                    setIsConnected(false)
                    // If value changed, set ping interval back to initial
                    smartIntervalRef.current?.resetBackoff()
                }
                return
            }
        })
    }, [engine, isConnected])

    const handleChange = useCallback(
        ({ isConnectedToDhis2: newStatus }) => {
            console.log('handling change')
            const smartInterval = smartIntervalRef.current

            if (newStatus !== isConnected) {
                console.log(
                    'status changed; resetting backoff. connected:',
                    newStatus
                )

                setIsConnected(newStatus)
                // If value changed, set ping interval back to initial
                smartInterval?.resetBackoff()
            }
            // Either way, snooze ping timer
            smartInterval?.snooze()
        },
        [isConnected]
    )

    React.useEffect(() => {
        const smartInterval = new SmartInterval({
            initialDelay: 5000,
            // don't ping if window isn't focused or visible
            initialPauseValue:
                !document.hasFocus() || document.visibilityState !== 'visible',
            callback: ping,
        })
        smartIntervalRef.current = smartInterval

        // todo: remove console logs & simplify these
        const handleBlur = () => {
            console.log('handling blur')
            smartInterval.pause()
        }
        const handleFocus = () => {
            console.log('handling focus')
            smartInterval.resume()
        }
        // On network change, ping immediately to test server connection
        const handleOffline = () => {
            console.log('handling offline')
            // Only ping when going offline -- it's theoretically no-cost
            // for both online and offline servers. Pinging when going online
            // can be costly for clients connecting over the internet to online
            // servers.
            smartInterval.invokeCallbackImmediately()
        }

        window.addEventListener('blur', handleBlur)
        window.addEventListener('focus', handleFocus)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('offline', handleOffline)

            // clean up smart interval
            smartInterval.clear()
        }
    }, [ping])

    React.useEffect(() => {
        const unsubscribe = offlineInterface.subscribeToDhis2ConnectionStatus({
            onChange: handleChange,
        })
        return () => {
            unsubscribe()
        }
    }, [offlineInterface, handleChange])

    console.log('provider rerender')

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
