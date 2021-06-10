import throttle from 'lodash/throttle'
import { useState, useEffect } from 'react'

/**
 * Returns the browser's online status. Updates in response to 'online' and
 * 'offline' events. By default, throttles updates to once every second to
 * avoid UI flicker, but that delay can be configured with the
 * `options.throttleDelay` param.
 *
 * TODO: Add option to periodically ping server to check online status.
 *
 * @param {Object} [options]
 * @param {Number} [options.throttleDelay] - Timeout delay to throttle updates, in ms
 * @returns {Object} `{ online, offline }` booleans. Each is the opposite of the other.
 */
export function useOnlineStatus(options) {
    const [online, setOnline] = useState(navigator.onLine)

    const updateState = throttle(
        ({ type }) => setOnline(type === 'online'),
        options?.throttleDelay || 1000
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
