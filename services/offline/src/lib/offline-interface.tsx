import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'
import { OfflineInterface } from '../types'

// This is to prevent 'offlineInterface could be null' type-checking errors
const noopOfflineInterface: OfflineInterface = {
    pwaEnabled: false,
    subscribeToDhis2ConnectionStatus: () => () => undefined,
    startRecording: async () => undefined,
    getCachedSections: async () => [],
    removeSection: async () => false,
}

const OfflineInterfaceContext = createContext<OfflineInterface>(
    noopOfflineInterface
)

interface OfflineInterfaceProviderInput {
    offlineInterface: OfflineInterface
    children: React.ReactNode
}

/**
 * Receives an OfflineInterface instance as a prop (presumably from the app
 * adapter) and provides it as context for other offline tools.
 *
 * On mount, it initializes the offline interface, which (among other things)
 * checks for service worker updates and, if updates are ready, prompts the
 * user with an alert to skip waiting and reload the page to use new content.
 */
export function OfflineInterfaceProvider({
    offlineInterface,
    children,
}: OfflineInterfaceProviderInput): JSX.Element {
    return (
        <OfflineInterfaceContext.Provider value={offlineInterface}>
            {children}
        </OfflineInterfaceContext.Provider>
    )
}

OfflineInterfaceProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({ init: PropTypes.func }),
}

export function useOfflineInterface(): OfflineInterface {
    const offlineInterface = useContext(OfflineInterfaceContext)

    if (offlineInterface === undefined) {
        throw new Error(
            'Offline interface context not found. If this app is using the app platform, make sure `pwa: { enabled: true }` is in d2.config.js. If this is not a platform app, make sure your app is wrapped with an app-runtime <Provider> or an <OfflineProvider> from app-service-offline.'
        )
    }

    return offlineInterface
}
