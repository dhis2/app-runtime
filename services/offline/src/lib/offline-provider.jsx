import PropTypes from 'prop-types'
import React from 'react'
import { CacheableSectionProvider } from './cacheable-section-state'
import { OfflineInterfaceProvider } from './offline-interface'

/** A context provider for all the relevant offline contexts */
export function OfflineProvider({ offlineInterface, children }) {
    // If an offline interface is not provided, or if one is provided and PWA
    // is not enabled, skip adding context providers
    if (!offlineInterface) {
        return children
    }

    // If PWA is not enabled, just init interface to make sure new SW gets
    // activated with code that unregisters SW. Not technically necessary if a
    // killswitch SW takes over, but the killswitch may not always be in use.
    // Then, skip adding any context
    if (!offlineInterface.pwaEnabled) {
        offlineInterface.init({ promptUpdate: ({ onConfirm }) => onConfirm() })
        return children
    }

    return (
        <OfflineInterfaceProvider offlineInterface={offlineInterface}>
            <CacheableSectionProvider>{children}</CacheableSectionProvider>
        </OfflineInterfaceProvider>
    )
}

OfflineProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({
        init: PropTypes.func,
        pwaEnabled: PropTypes.bool,
    }),
}
