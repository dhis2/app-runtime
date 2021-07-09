import PropTypes from 'prop-types'
import React, { useState, useEffect, useContext } from 'react'
import { useCachedSection } from './cached-sections'
import { useOfflineInterface } from './offline-interface'

const recordingStates = {
    default: 'default',
    pending: 'pending',
    recording: 'recording',
    error: 'error',
}

const RecordingStatesContext = React.createContext()

/**
 * Provides context for cacheable sections' recording states, which will
 * determine how that component will render. The provider will be a part of
 * the OfflineProvider.
 *
 * TODO: This will be refactored into a mutable state provider and combined
 * with Cached Sections to become one provider that avoids unnecessary rerenders
 * of consumer components.
 */
export function RecordingStatesProvider({ children }) {
    const [recordingStates, setRecordingStates] = useState(new Map())

    const get = id => recordingStates.get(id)
    const set = (id, recordingState) =>
        setRecordingStates(rs => new Map(rs).set(id, recordingState))
    const remove = id =>
        setRecordingStates(rs => {
            rs.delete(id)
            return rs
        })

    const context = { get, set, remove }

    return (
        <RecordingStatesContext.Provider value={context}>
            {children}
        </RecordingStatesContext.Provider>
    )
}
RecordingStatesProvider.propTypes = { children: PropTypes.node }

/** Returns `{ get(), set(value), remove() }` for a particular ID */
function useRecordingState(id) {
    const context = useContext(RecordingStatesContext)
    if (!context)
        throw new Error(
            'useRecordingState must be used within a RecordingStatesProvider component'
        )
    const newContext = {
        get: () => context.get(id),
        set: val => context.set(id, val),
        remove: () => context.remove(id),
    }
    return newContext
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
export function useCacheableSection(id) {
    const offlineInterface = useOfflineInterface()
    const { isCached, lastUpdated, remove, updateSections } = useCachedSection(
        id
    )
    const recordingState = useRecordingState(id)

    // On mount, add recording state for this ID to context
    useEffect(() => {
        recordingState.set(recordingStates.default)
        // On unnmount, remove recording state
        return recordingState.remove
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function startRecording({
        recordingTimeoutDelay = 1000,
        onStarted,
        onCompleted,
        onError,
    } = {}) {
        // This promise resolving means that the message to the service worker
        // to start recording was successful. Waiting for resolution prevents
        // unnecessarily rerendering the whole component in case of an error
        return offlineInterface
            .startRecording({
                sectionId: id,
                recordingTimeoutDelay,
                onStarted: (...args) => {
                    onRecordingStarted(...args)
                    onStarted && onStarted(...args)
                },
                onCompleted: (...args) => {
                    onRecordingCompleted(...args)
                    onCompleted && onCompleted(...args)
                },
                onError: (...args) => {
                    onRecordingError(...args)
                    onError && onError(...args)
                },
            })
            .then(() => recordingState.set(recordingStates.pending))
    }

    function onRecordingStarted() {
        recordingState.set(recordingStates.recording)
    }

    function onRecordingCompleted() {
        recordingState.set(recordingStates.default)
        updateSections()
    }

    function onRecordingError(error) {
        console.error('Error during recording:', error)
        recordingState.set(recordingStates.error)
    }

    // isCached, lastUpdated, remove: _could_ be accessed by useCachedSection,
    // but provided through this hook for convenience
    return {
        recordingState: recordingState.get(),
        startRecording,
        lastUpdated,
        isCached,
        remove,
    }
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
export function CacheableSection({ id, loadingMask, children }) {
    // Accesses recording state that will be controlled by useCacheableSection
    // hook
    const { get } = useRecordingState(id)
    const recordingState = get()

    // The following causes the component to reload in the event of a recording
    // error; the state will be cleared next time recording moves to pending.
    // It fixes a component getting stuck while rendered without data after
    // failing a recording while offline.
    // Errors can be handled in the `onError` callback to `startRecording`.
    if (recordingState === recordingStates.error) return children

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
