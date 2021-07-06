import PropTypes from 'prop-types'
import React from 'react'
import { RecordingStatesProvider } from './cacheable-section'
import { CachedSectionsProvider } from './cached-sections'
import { OfflineInterfaceProvider } from './offline-interface'

/** A context provider for all the relevant offline contexts */
export function OfflineProvider({ offlineInterface, children }) {
    return (
        <OfflineInterfaceProvider offlineInterface={offlineInterface}>
            <RecordingStatesProvider>
                <CachedSectionsProvider>{children}</CachedSectionsProvider>
            </RecordingStatesProvider>
        </OfflineInterfaceProvider>
    )
}

OfflineProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({}),
}
