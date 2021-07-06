import { useGlobalState, useGlobalStateMutation } from './global-state-service'
import { useOfflineInterface } from './offline-interface'

// Functions in here use the global state service to manage cacheable section
// state in a performant way

/**
 * Uses an optimized global state to manage 'recording state' values without
 * unnecessarily rerendering all consuming components
 */
export function useRecordingState(id) {
    const [recordingState] = useGlobalState(state => state.recordingStates[id])
    const setRecordingState = useGlobalStateMutation(newState => state => ({
        ...state,
        [id]: newState,
    }))
    const removeRecordingState = useGlobalStateMutation(() => state => {
        const newState = { ...state }
        delete newState[id]
        return newState
    })

    return { recordingState, setRecordingState, removeRecordingState }
}

/**
 * Returns a function that syncs cached sections in the global state
 * with IndexedDB, so that IndexedDB is the single source of truth
 */
function useUpdateCachedSections() {
    const offlineInterface = useOfflineInterface()
    const setCachedSections = useGlobalStateMutation(
        cachedSections => state => ({
            ...state,
            cachedSections,
        })
    )

    return async function updateCachedSections() {
        const sections = await offlineInterface.getCachedSections()
        const newSections = sections.reduce(
            (result, { sectionId, lastUpdated }) => {
                result[sectionId] = lastUpdated
            },
            {}
        )
        setCachedSections(newSections)
    }
}

/**
 * Uses global state to manage an object of cached sections' statuses
 *
 * @returns {Object} { cachedSections: Object, removeSection: Function }
 */
export function useCachedSections() {
    const [cachedSections] = useGlobalState(state => state.cachedSections)
    const updateCachedSections = useUpdateCachedSections()
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
        if (success) updateCachedSections()
        return success
    }

    return { cachedSections, removeSection }
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
    const updateCachedSections = useUpdateCachedSections()
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
        if (success) updateCachedSections()
        return success
    }

    return { lastUpdated, remove }
}
