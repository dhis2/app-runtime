import debounce from 'lodash/debounce'
import { useState, useEffect, useCallback } from 'react'

type milliseconds = number
interface OnlineStatusOptions {
    debounceDelay?: milliseconds
}

interface OnlineStatus {
    online: boolean
    offline: boolean
    lastOnline: Date | null
}

const lastOnlineKey = 'dhis2.lastOnline'

// TODO: Add option to periodically ping server to check online status.
// TODO: Add logic to return a variable indicating unstable connection.

/**
 * Returns the browser's online status. Updates in response to 'online' and
 * 'offline' events. By default, debounces updates to once every second to
 * avoid UI flicker, but that delay can be configured with the
 * `options.debounceDelay` param.
 *
 * On state change, updates the `dhis2.lastOnline` property in local storage
 * for consuming apps to format and display. Returns `lastOnline` as `null` if
 * online or as a Date if offline.
 *
 * @param {Object} [options]
 * @param {Number} [options.debounceDelay] - Timeout delay to debounce updates, in ms
 * @returns {Object} `{ online: boolean, offline: boolean, lastOnline: Date | null }`
 */
export function useOnlineStatus(
    options: OnlineStatusOptions = {}
): OnlineStatus {
    // initialize state to `navigator.onLine` value
    const [online, setOnline] = useState(navigator.onLine)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateState = useCallback(
        debounce(({ type }: Event) => {
            if (type === 'online') {
                setOnline(true)
            } else if (type === 'offline') {
                if (online || !localStorage.getItem(lastOnlineKey)) {
                    localStorage.setItem(
                        lastOnlineKey,
                        new Date(Date.now()).toUTCString()
                    )
                }
                setOnline(false)
            }
        }, options.debounceDelay || 1000),
        [options.debounceDelay]
    )

    // on 'online' or 'offline' events, set state
    useEffect(() => {
        window.addEventListener('online', updateState)
        window.addEventListener('offline', updateState)
        return () => {
            updateState.flush()
            window.removeEventListener('online', updateState)
            window.removeEventListener('offline', updateState)
        }
    }, [updateState])

    // Only fetch if `online === false` as local storage is synchronous and disk-based
    const lastOnline = !online && localStorage.getItem(lastOnlineKey)

    return {
        online,
        offline: !online,
        lastOnline: lastOnline ? new Date(lastOnline) : null,
    }
}
