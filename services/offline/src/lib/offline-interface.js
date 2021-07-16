import { useAlert } from '@dhis2/app-service-alerts'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const OfflineContext = createContext()

/**
 * Receives an OfflineInterface instance as a prop (presumably from the app
 * adapter) and provides it as context for other offline tools.
 *
 * On mount, it initializes the offline interface, which (among other things)
 * checks for service worker updates and, if updates are ready, prompts the
 * user with an alert to skip waiting and reload the page to use new content.
 */
export function OfflineInterfaceProvider({ offlineInterface, children }) {
    const { show } = useAlert(
        ({ message }) => message,
        ({ action, onConfirm }) => ({
            actions: [{ label: action, onClick: onConfirm }],
            permanent: true,
        })
    )

    React.useEffect(() => {
        // Init returns a tear-down function
        return offlineInterface.init({ promptUpdate: show })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <OfflineContext.Provider value={offlineInterface}>
            {children}
        </OfflineContext.Provider>
    )
}

OfflineInterfaceProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({ init: PropTypes.func }),
}

export function useOfflineInterface() {
    const offlineInterface = useContext(OfflineContext)

    if (offlineInterface === undefined) {
        throw new Error(
            'useOfflineInterface must be used within an OfflineInterfaceProvider. Make sure `pwa: { enabled: true }` in `d2.config.js`.'
        )
    }

    return offlineInterface
}
