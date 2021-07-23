import PropTypes from 'prop-types'
import React from 'react'
import { CacheableSectionProvider } from './cacheable-section-state'
import { OfflineInterfaceProvider } from './offline-interface'

interface PromptUpdate {
    (params: { message: string; action: string; onConfirm: () => void }): void
}

interface StartRecording {
    (params: {
        sectionId: string
        recordingTimeoutDelay: number
        onStarted: () => void
        onCompleted: () => void
        onError: (err: Error) => void
    }): Promise<undefined>
}

interface IndexedDBCachedSection {
    sectionId: string
    lastUpdated: Date
    // this may change in the future:
    requests: number
}

interface OfflineInterface {
    readonly pwaEnabled: boolean
    init: (params: { promptUpdate: PromptUpdate }) => () => void
    startRecording: StartRecording
    getCachedSections: () => Promise<IndexedDBCachedSection[]>
    removeCachedSection: (id: string) => Promise<boolean>
}

interface OfflineProviderInput {
    offlineInterface?: OfflineInterface
    children: React.ReactNode
}

/** A context provider for all the relevant offline contexts */
export function OfflineProvider({
    offlineInterface,
    children,
}: OfflineProviderInput): React.ReactNode {
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
