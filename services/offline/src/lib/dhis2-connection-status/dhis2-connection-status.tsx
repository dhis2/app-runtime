import { useConfig } from '@dhis2/app-service-config'
import { throttle } from 'lodash'
import PropTypes from 'prop-types'
import React, {
    useCallback,
    useState,
    useRef,
    useMemo,
    useEffect,
    useContext,
} from 'react'
import { useOfflineInterface } from '../offline-interface'
import { devDebugLog } from './dev-debug-log'
import { isPingAvailable } from './is-ping-available'
import createSmartInterval, { SmartInterval } from './smart-interval'
import { usePingQuery } from './use-ping-query'

// Utils for saving 'last connected' datetime in local storage
const lastConnectedKey = 'dhis2.lastConnected'
type AppName = string | undefined
export const getLastConnectedKey = (appName?: AppName) =>
    appName ? `${lastConnectedKey}.${appName}` : lastConnectedKey
const updateLastConnected = (appName: AppName) => {
    // use Date.now() because it's easier to mock for easier unit testing
    const now = new Date(Date.now())
    localStorage.setItem(getLastConnectedKey(appName), now.toUTCString())
    return now
}
const getLastConnected = (appName: AppName) => {
    const lastConnected = localStorage.getItem(getLastConnectedKey(appName))
    return lastConnected ? new Date(lastConnected) : null
}
const clearLastConnected = (appName: AppName) => {
    localStorage.removeItem(getLastConnectedKey(appName))
}

export interface Dhis2ConnectionStatus {
    isConnected: boolean
    isDisconnected: boolean
    lastConnected: Date | null
}

const Dhis2ConnectionStatusContext = React.createContext({
    isConnected: true,
    isDisconnected: false,
    lastConnected: null,
} as Dhis2ConnectionStatus)

/**
 * Provides a boolean indicating client's connection to the DHIS2 server,
 * which is different from connection to the internet.
 *
 * The context provider subscribes to messages from the SW tracking successes
 * and failures of requests to the DHIS2 server to determine connection status,
 * and then will initiate periodic pings if there are no incidental requests in
 * order to check the connection consistently
 */
export const Dhis2ConnectionStatusProvider = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    const offlineInterface = useOfflineInterface()
    const { appName, serverVersion } = useConfig()
    // The offline interface persists the latest update from the SW so that
    // this hook can initialize to an accurate value. The App Adapter in the
    // platform waits for this value to be populated before rendering the
    // the App Runtime provider (including this), but if that is not done,
    // `latestIsConnected` may be `null` depending on the outcome of race
    // conditions between the SW and the React component tree.
    const [isConnected, setIsConnected] = useState(
        offlineInterface.latestIsConnected
    )
    const ping = usePingQuery()
    const smartIntervalRef = useRef(null as null | SmartInterval)

    /**
     * Update state, reset ping backoff if changed, and update
     * the lastConnected value in localStorage
     */
    const updateConnectedState = useCallback(
        (newIsConnected) => {
            // use 'set' with a function as param to get latest isConnected
            // without needing it as a dependency for useCallback
            setIsConnected((prevIsConnected) => {
                devDebugLog('[D2CS] updating state:', {
                    prevIsConnected,
                    newIsConnected,
                })

                if (newIsConnected !== prevIsConnected) {
                    // if value changed, reset ping interval to initial delay
                    smartIntervalRef.current?.reset()

                    if (newIsConnected) {
                        // Need to clear this here so it doesn't affect another
                        // session that starts while offline
                        clearLastConnected(appName)
                    } else {
                        updateLastConnected(appName)
                    }
                }
                return newIsConnected
            })
        },
        [appName]
    )

    // Note that the SW is configured to not cache ping requests and won't
    // trigger `handleChange` below to avoid redundant signals. This also
    // helps to detect the connectivity status when the SW is not available
    // for some reason (maybe private browsing, first installation, or
    // insecure browser context)
    const pingAndHandleStatus = useCallback(() => {
        return ping()
            .then(() => {
                // Ping is successful; set 'connected'
                updateConnectedState(true)
            })
            .catch((err) => {
                console.error('Ping failed:', err.message)
                updateConnectedState(false)
            })
    }, [ping, updateConnectedState])

    /** Called when SW reports updates from incidental network traffic */
    const onUpdate = useCallback(
        ({ isConnected: newIsConnected }) => {
            devDebugLog('[D2CS] handling update from sw')

            // Snooze ping timer to reduce pings since we know state from SW
            smartIntervalRef.current?.snooze()
            updateConnectedState(newIsConnected)
        },
        [updateConnectedState]
    )

    useEffect(() => {
        // If the /api/ping endpoint is not available on this instance, skip
        // pinging with the smart interval. Just use the service worker
        if (!serverVersion || !isPingAvailable(serverVersion)) {
            return
        }

        // Only create the smart interval once
        const smartInterval = createSmartInterval({
            // don't ping if window isn't focused or visible
            initialPauseValue:
                !document.hasFocus() || document.visibilityState !== 'visible',
            callback: pingAndHandleStatus,
        })
        smartIntervalRef.current = smartInterval

        const handleBlur = () => smartInterval.pause()
        const handleFocus = () => smartInterval.resume()
        // Pinging when going offline should be low/no-cost in both online and
        // local servers
        const handleOffline = () => smartInterval.invokeCallbackImmediately()
        // Pinging when going online has a cost but improves responsiveness of
        // the connection status -- only do it once every 15 seconds at most
        const handleOnline = throttle(
            () => smartInterval.invokeCallbackImmediately(),
            15000
        )

        window.addEventListener('blur', handleBlur)
        window.addEventListener('focus', handleFocus)
        window.addEventListener('offline', handleOffline)
        window.addEventListener('online', handleOnline)

        return () => {
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('online', handleOnline)

            // clean up smart interval
            smartInterval.clear()
        }
    }, [pingAndHandleStatus, serverVersion])

    useEffect(() => {
        const unsubscribe = offlineInterface.subscribeToDhis2ConnectionStatus({
            onUpdate,
        })
        return () => {
            unsubscribe()
        }
    }, [offlineInterface, onUpdate])

    // Memoize this value to prevent unnecessary rerenders of context provider
    const contextValue = useMemo(
        () => ({
            // in the unlikely circumstance that offlineInterface.latestIsConnected
            // is `null` when this initializes, fail safe by defaulting to
            // `isConnected: false`
            isConnected: Boolean(isConnected),
            isDisconnected: !isConnected,
            lastConnected: isConnected
                ? null
                : // Only evaluate if disconnected, since local storage
                  // is synchronous and disk-based.
                  // If lastConnected is not set in localStorage though, set it.
                  // (relevant on startup)
                  getLastConnected(appName) || updateLastConnected(appName),
        }),
        [isConnected, appName]
    )

    return (
        <Dhis2ConnectionStatusContext.Provider value={contextValue}>
            {children}
        </Dhis2ConnectionStatusContext.Provider>
    )
}
Dhis2ConnectionStatusProvider.propTypes = {
    children: PropTypes.node,
}

export const useDhis2ConnectionStatus = (): Dhis2ConnectionStatus => {
    const context = useContext(Dhis2ConnectionStatusContext)

    if (!context) {
        throw new Error(
            'useDhis2ConnectionStatus must be used within a Dhis2ConnectionStatus provider'
        )
    }

    return context
}
