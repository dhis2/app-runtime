import debounce from 'lodash/debounce'
import { useState, useEffect, useCallback } from 'react'

/**
 * Returns the browser's online status. Updates in response to 'online' and
 * 'offline' events. By default, debounces updates to once every second to
 * avoid UI flicker, but that delay can be configured with the
 * `options.debounceDelay` param.
 *
 * TODO: Add option to periodically ping server to check online status.
 * TODO: Add logic to return a variable indicating unstable connection.
 *
 * @param {Object} [options]
 * @param {Number} [options.debounceDelay] - Timeout delay to debounce updates, in ms
 * @returns {Object} `{ online, offline }` booleans. Each is the opposite of the other.
 */
export function useOnlineStatus(options) {
    const [online, setOnline] = useState(navigator.onLine)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateState = useCallback(
        debounce(
            ({ type }) => setOnline(type === 'online'),
            options?.debounceDelay || 1000
        ),
        []
    )

    // on 'online' or 'offline' events, set state
    useEffect(() => {
        window.addEventListener('online', updateState)
        window.addEventListener('offline', updateState)
        return () => {
            updateState.cancel()
            window.removeEventListener('online', updateState)
            window.removeEventListener('offline', updateState)
        }
    }, [updateState])

    return { online, offline: !online }
}
