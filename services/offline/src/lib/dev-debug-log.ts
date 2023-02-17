const shouldLog = localStorage.getItem('dhis2.debugConnectionStatus')
if (shouldLog) {
    console.log(
        'Logging for dhis2ConnectionStatus is enabled. Remove the `dhis2.debugConnectionStatus` item in localStorage to disable logging.'
    )
}

/**
 * This can be used to log info if the `dhis2.debugConnectionStatus` value
 * in localStorage is set to a truthy value during development.
 * Set the value manually and refresh the page to see the logs.
 *
 * The behavior of the connection status can be quite hard to inspect without
 * logs, but the logs are quite chatty and should be omitted normally.
 */
export function devDebugLog(...args: any[]) {
    if (shouldLog) {
        console.log(...args)
    }
}
