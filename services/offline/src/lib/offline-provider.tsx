import PropTypes from 'prop-types'
import React from 'react'
import { OfflineInterface } from '../types'
import { CacheableSectionProvider } from './cacheable-section-state'
import { Dhis2ConnectionStatusProvider } from './dhis2-connection-status'
import { OfflineInterfaceProvider } from './offline-interface'
import { OnlineStatusMessageProvider } from './online-status-message'

interface OfflineProviderInput {
    offlineInterface?: OfflineInterface
    children?: React.ReactNode
}

/** A context provider for all the relevant offline contexts */
export function OfflineProvider({
    offlineInterface,
    children,
}: OfflineProviderInput): JSX.Element {
    // If an offline interface is not provided, or if one is provided and PWA
    // is not enabled, skip adding context providers
    if (!offlineInterface || !offlineInterface.pwaEnabled) {
        return <>{children}</>
    }

    return (
        <OfflineInterfaceProvider offlineInterface={offlineInterface}>
            <Dhis2ConnectionStatusProvider>
                <CacheableSectionProvider>
                    <OnlineStatusMessageProvider>
                        {children}
                    </OnlineStatusMessageProvider>
                </CacheableSectionProvider>
            </Dhis2ConnectionStatusProvider>
        </OfflineInterfaceProvider>
    )
}

OfflineProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({
        pwaEnabled: PropTypes.bool,
    }),
}
