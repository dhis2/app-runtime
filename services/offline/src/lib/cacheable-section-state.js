import PropTypes from 'prop-types'
import React from 'react'
import {
    createStore,
    useGlobalState,
    useGlobalStateMutation,
    GlobalStateProvider,
} from './global-state-service'
import { useOfflineInterface } from './offline-interface'

// Functions in here use the global state service to manage cacheable section
// state in a performant way

/**
 * Helper that transforms an array of cached section objects from the IndexedDB
 * into an object of values keyed by section ID
 *
 * @param {Array} list - An array of section objects
 * @returns {Object} An object of sections, keyed by ID
 */
function transformSections(sectionsArray) {
    return sectionsArray.reduce(
        (result, { sectionId, lastUpdated }) => ({
            ...result,
            [sectionId]: lastUpdated,
        }),
        {}
    )
}

/**
 * Create a store for Cacheable Section state.
 * Expected to be used in app adapter
 */
export function createCacheableSectionStore() {
    const initialState = { recordingStates: {}, cachedSections: {} }
    return createStore(initialState)
}

/**
 * Provides context for a global state context which will track cached
 * sections' status and cacheable sections' recording states, which will
 * determine how that component will render. The provider will be a part of
 * the OfflineProvider.
 */
export function CacheableSectionProvider({ children, store }) {
    const offlineInterface = useOfflineInterface()

    // On load, get sections and add to store
    React.useEffect(() => {
        offlineInterface.getCachedSections().then(sections => {
            const sectionsById = transformSections(sections)
            store.mutate(state => ({
                ...state,
                cachedSections: sectionsById,
            }))
        })
    }, [store, offlineInterface])

    return <GlobalStateProvider store={store}>{children}</GlobalStateProvider>
}
CacheableSectionProvider.propTypes = {
    children: PropTypes.node,
    store: PropTypes.shape({ mutate: PropTypes.func }),
}

/**
 * Uses an optimized global state to manage 'recording state' values without
 * unnecessarily rerendering all consuming components
 *
 * @param {String} id - ID of the cacheable section to track
 * @returns {Object} { recordingState: String, setRecordingState: Function, removeRecordingState: Function}
 */
export function useRecordingState(id) {
    const [recordingState] = useGlobalState(state => state.recordingStates[id])
    const setRecordingState = useGlobalStateMutation(newState => state => ({
        ...state,
        recordingStates: { ...state.recordingStates, [id]: newState },
    }))
    const removeRecordingState = useGlobalStateMutation(() => state => {
        const recordingStates = { ...state.recordingStates }
        delete recordingStates[id]
        return { ...state, recordingStates }
    })

    return { recordingState, setRecordingState, removeRecordingState }
}

/**
 * Returns a function that syncs cached sections in the global state
 * with IndexedDB, so that IndexedDB is the single source of truth
 *
 * @returns {Function} syncCachedSections
 */
function useSyncCachedSections() {
    const offlineInterface = useOfflineInterface()
    const setCachedSections = useGlobalStateMutation(
        cachedSections => state => ({
            ...state,
            cachedSections,
        })
    )

    return async function syncCachedSections() {
        const sections = await offlineInterface.getCachedSections()
        const sectionsById = transformSections(sections)
        setCachedSections(sectionsById)
    }
}

/**
 * Uses global state to manage an object of cached sections' statuses
 *
 * @returns {Object} { cachedSections: Object, removeSection: Function }
 */
export function useCachedSections() {
    const [cachedSections] = useGlobalState(state => state.cachedSections)
    const syncCachedSections = useSyncCachedSections()
    const offlineInterface = useOfflineInterface()

    /**
     * Uses offline interface to remove a section from IndexedDB and Cache
     * Storage.
     *
     * Returns a promise that resolves to `true` if a section is found and
     * deleted, or `false` if asection with the specified ID does not exist.
     */
    async function removeSection(id) {
        const success = await offlineInterface.removeSection(id)
        if (success) await syncCachedSections()
        return success
    }

    return {
        cachedSections,
        removeSection,
        syncCachedSections,
    }
}

/**
 * Uses global state to manage the cached status of just one section, which
 * prevents unnecessary rerenders of consuming components
 *
 * @param {String} id
 * @returns {Object} { lastUpdated: Date, remove: Function }
 */
export function useCachedSection(id) {
    const [lastUpdated] = useGlobalState(state => state.cachedSections[id])
    const syncCachedSections = useSyncCachedSections()
    const offlineInterface = useOfflineInterface()

    /**
     * Uses offline interface to remove a section from IndexedDB and Cache
     * Storage.
     *
     * Returns `true` if a section is found and deleted, or `false` if a
     * section with the specified ID does not exist.
     */
    async function remove() {
        const success = await offlineInterface.removeSection(id)
        if (success) await syncCachedSections()
        return success
    }

    return {
        lastUpdated,
        isCached: !!lastUpdated,
        remove,
        syncCachedSections,
    }
}
