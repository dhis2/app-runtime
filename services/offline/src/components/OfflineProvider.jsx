import PropTypes from 'prop-types'
import React from 'react'
import { RecordingStatesProvider } from '../lib/cacheable-section'
import { CachedSectionsProvider } from '../lib/cached-sections'
import { OfflineInterfaceProvider } from '../lib/offline-interface'

export function OfflineProvider({ offlineInterface, pwaEnabled, children }) {
    return (
        <OfflineInterfaceProvider
            offlineInterface={offlineInterface}
            pwaEnabled={pwaEnabled}
        >
            <RecordingStatesProvider>
                <CachedSectionsProvider>{children}</CachedSectionsProvider>
            </RecordingStatesProvider>
        </OfflineInterfaceProvider>
    )
}

OfflineProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({}),
    pwaEnabled: PropTypes.bool,
}
