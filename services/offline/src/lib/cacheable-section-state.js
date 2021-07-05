import { useGlobalState, useGlobalStateMutation } from './global-state-service'
import { useOfflineInterface } from './offline-interface'

// Should I just rename the global state components to something appropriate for
// cacheable sections in this package?

export function useCacheableSectionState(id) {
    const [sectionState] = useGlobalState(state => state[id])
    const setSectionState = useGlobalStateMutation(
        newSectionState => state => ({
            ...state,
            [id]: { ...state[id], ...newSectionState },
        })
    )
    const removeSectionState = useGlobalStateMutation(() => state => {
        delete state[id]
        return state
    })

    return { sectionState, setSectionState, removeSectionState }
}

function useRecordingState(id) {
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
export function useUpdateCachedSections() {
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

export function useCachedSections() {
    const [cachedSections] = useGlobalState(state => state.cachedSections)
    const updateCachedSections = useUpdateCachedSections()
    const offlineInterface = useOfflineInterface()

    /**
     * Uses offline interface to remove a section from IndexedDB and Cache
     * Storage.
     *
     * Returns `true` if a section is found and deleted, or `false` if a
     * section with the specified ID does not exist.
     */
    async function removeSection(id) {
        const success = await offlineInterface.removeSection(id)
        if (success) updateCachedSections()
        return success
    }

    return { cachedSections, removeSection }
}

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

// function useCacheableSection(id) {
//     const {
//         recordingState,
//         setRecordingState,
//         removeRecordingState,
//     } = useRecordingState(id)
//     const { lastUpdated, remove } = useCachedSection(id)

//     React.useEffect(() => {
//         setRecordingState('default')
//         return removeRecordingState
//     })

//     function startRecording() {
//         // send message
//         setRecordingState('pending')
//     }

//     const onRecordingStarted = () => setRecordingState('recording')
//     const onRecordingCompleted = () => setRecordingState('default')
//     const onRecordingError = () => setRecordingState('error')

//     return { recordingState, startRecording }
// }
