import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { RecordingState } from '../types'
import { useRecordingState, useCachedSection } from './cacheable-section-state'
import { useOfflineInterface } from './offline-interface'

const recordingStates: { [index: string]: RecordingState } = {
    default: 'default',
    pending: 'pending',
    recording: 'recording',
    error: 'error',
}

interface CacheableSectionStartRecordingOptions {
    recordingTimeoutDelay?: number
    onStarted?: () => void
    onCompleted?: () => void
    onError?: (err: Error) => void
}

export type CacheableSectionStartRecording = (
    options?: CacheableSectionStartRecordingOptions
) => Promise<any>

interface CacheableSectionControls {
    recordingState: RecordingState
    startRecording: CacheableSectionStartRecording
    lastUpdated: Date | undefined
    isCached: boolean
    remove: () => Promise<boolean>
}

/**
 * Returns the main controls for a cacheable section and manages recording
 * state, which affects the render state of the CacheableSection component.
 * Also returns the cached status of the section, which come straight from
 * the `useCachedSection` hook.
 *
 * @param {String} id
 * @returns {Object}
 */
export function useCacheableSection(id: string): CacheableSectionControls {
    const offlineInterface = useOfflineInterface()
    const {
        isCached,
        lastUpdated,
        remove,
        syncCachedSections,
    } = useCachedSection(id)
    const {
        recordingState,
        setRecordingState,
        removeRecordingState,
    } = useRecordingState(id)

    useEffect(() => {
        // On mount, add recording state for this ID to context
        if (!recordingState) {
            setRecordingState(recordingStates.default)
        }
        // On unnmount, remove recording state
        return () => {
            if (recordingState === recordingStates.default) {
                removeRecordingState()
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function startRecording({
        recordingTimeoutDelay = 1000,
        onStarted,
        onCompleted,
        onError,
    }: CacheableSectionStartRecordingOptions = {}) {
        // This promise resolving means that the message to the service worker
        // to start recording was successful. Waiting for resolution prevents
        // unnecessarily rerendering the whole component in case of an error
        return offlineInterface
            .startRecording({
                sectionId: id,
                recordingTimeoutDelay,
                onStarted: () => {
                    onRecordingStarted()
                    onStarted && onStarted()
                },
                onCompleted: () => {
                    onRecordingCompleted()
                    onCompleted && onCompleted()
                },
                onError: error => {
                    onRecordingError(error)
                    onError && onError(error)
                },
            })
            .then(() => setRecordingState(recordingStates.pending))
    }

    function onRecordingStarted() {
        setRecordingState(recordingStates.recording)
    }

    function onRecordingCompleted() {
        setRecordingState(recordingStates.default)
        syncCachedSections()
    }

    function onRecordingError(error: Error) {
        console.error('Error during recording:', error)
        setRecordingState(recordingStates.error)
    }

    // isCached, lastUpdated, remove: _could_ be accessed by useCachedSection,
    // but provided through this hook for convenience
    return {
        recordingState,
        startRecording,
        lastUpdated,
        isCached,
        remove,
    }
}

interface CacheableSectionProps {
    id: string
    loadingMask: JSX.Element
    children: React.ReactNode
}

/**
 * Used to wrap the relevant component to be recorded and saved offline.
 * Depending on the recording state of the section, this wrapper will
 * render its children, not render its children while recording is pending,
 * or RErerender the chilren to force data fetching to record by the service
 * worker.
 *
 * During recording, a loading mask provided by props is also rendered that is
 * intended to prevent other interaction with the app that might interfere
 * with the recording process.
 */
export function CacheableSection({
    id,
    loadingMask,
    children,
}: CacheableSectionProps): JSX.Element {
    // Accesses recording state that useCacheableSection controls
    const { recordingState } = useRecordingState(id)

    // The following causes the component to reload in the event of a recording
    // error; the state will be cleared next time recording moves to pending.
    // It fixes a component getting stuck while rendered without data after
    // failing a recording while offline.
    // Errors can be handled in the `onError` callback to `startRecording`.
    if (recordingState === recordingStates.error) {
        return <>{children}</>
    }

    // Handling rendering with the following conditions prevents an unncessary
    // rerender after successful recording
    return (
        <>
            {recordingState === recordingStates.recording && loadingMask}
            {recordingState !== recordingStates.pending && children}
        </>
    )
}

CacheableSection.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
    loadingMask: PropTypes.node,
}
