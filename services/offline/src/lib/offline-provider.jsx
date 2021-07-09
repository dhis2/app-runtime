import PropTypes from 'prop-types'
import React from 'react'
import { CacheableSectionProvider } from './cacheable-section-state'
import { OfflineInterfaceProvider } from './offline-interface'

/** A context provider for all the relevant offline contexts */
export function OfflineProvider({
    offlineInterface,
    cacheableSectionStore,
    children,
}) {
    return (
        <OfflineInterfaceProvider offlineInterface={offlineInterface}>
            <CacheableSectionProvider store={cacheableSectionStore}>
                {children}
            </CacheableSectionProvider>
        </OfflineInterfaceProvider>
    )
}

OfflineProvider.propTypes = {
    cacheableSectionStore: PropTypes.shape({}),
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({}),
}
