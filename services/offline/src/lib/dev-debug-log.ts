const shouldLog = localStorage.getItem('dhis2.debugConnectionStatus')

/**
 * This can be used to log info if the `dhis2.debugConnectionStatus` value
 * in localStorage is set to a truthy value during development.
 * Set the value manually and refresh the page to see the logs.
 *
 * The behavior of the connection status can be quite hard to inspect without
 * logs, but the logs are quite chatty and should be omitted normally.
 */
export function devDebugLog(...args: any[]) {
    if (shouldLog && process.env.NODE_ENV === 'development') {
        console.log(...args)
    }
}
