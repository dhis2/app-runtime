import PropTypes from 'prop-types'
import React, { useEffect, useCallback, useMemo } from 'react'
import {
    GlobalStateStore,
    GlobalStateStoreMutationCreator,
    IndexedDBCachedSection,
    RecordingState,
} from '../types'
import {
    createStore,
    useGlobalState,
    useGlobalStateMutation,
    GlobalStateProvider,
} from './global-state-service'
import { useOfflineInterface } from './offline-interface'

// Functions in here use the global state service to manage cacheable section
// state in a performant way

interface CachedSectionsById {
    [index: string]: { lastUpdated: Date }
}

/**
 * Helper that transforms an array of cached section objects from the IndexedDB
 * into an object of values keyed by section ID
 *
 * @param {Array} list - An array of section objects
 * @returns {Object} An object of sections, keyed by ID
 */
function getSectionsById(
    sectionsArray: IndexedDBCachedSection[]
): CachedSectionsById {
    return sectionsArray.reduce(
        (result, { sectionId, lastUpdated }) => ({
            ...result,
            [sectionId]: { lastUpdated },
        }),
        {}
    )
}

/**
 * Create a store for Cacheable Section state.
 * Expected to be used in app adapter
 */
export function createCacheableSectionStore(): GlobalStateStore {
    const initialState = { recordingStates: {}, cachedSections: {} }
    return createStore(initialState)
}

/**
 * Helper hook that returns a value that will persist between renders but makes
 * sure to only set its initial state once.
 * See https://gist.github.com/amcgee/42bb2fa6d5f79e607f00e6dccc733482
 */
function useConst<Type>(factory: () => Type): Type {
    const ref = React.useRef<Type | null>(null)
    if (ref.current === null) {
        ref.current = factory()
    }
    return ref.current
}

/**
 * Provides context for a global state context which will track cached
 * sections' status and cacheable sections' recording states, which will
 * determine how that component will render. The provider will be a part of
 * the OfflineProvider.
 */
export function CacheableSectionProvider({
    children,
}: {
    children: React.ReactNode
}): JSX.Element {
    const offlineInterface = useOfflineInterface()
    const store = useConst(createCacheableSectionStore)

    // On load, get sections and add to store
    useEffect(() => {
        if (offlineInterface) {
            offlineInterface.getCachedSections().then((sections) => {
                store.mutate((state) => ({
                    ...state,
                    cachedSections: getSectionsById(sections),
                }))
            })
        }
    }, [store, offlineInterface])

    return <GlobalStateProvider store={store}>{children}</GlobalStateProvider>
}
CacheableSectionProvider.propTypes = {
    children: PropTypes.node,
}

interface RecordingStateControls {
    recordingState: RecordingState
    setRecordingState: (newState: RecordingState) => void
    removeRecordingState: () => void
}

/**
 * Uses an optimized global state to manage 'recording state' values without
 * unnecessarily rerendering all consuming components
 *
 * @param {String} id - ID of the cacheable section to track
 * @returns {Object} { recordingState: String, setRecordingState: Function, removeRecordingState: Function}
 */
export function useRecordingState(id: string): RecordingStateControls {
    const recordingStateSelector = useCallback(
        (state: any) => state.recordingStates[id],
        [id]
    )
    const [recordingState] = useGlobalState(recordingStateSelector)

    const setRecordingStateMutationCreator = useCallback<
        GlobalStateStoreMutationCreator<RecordingState>
    >(
        (newState) => (state: any) => ({
            ...state,
            recordingStates: { ...state.recordingStates, [id]: newState },
        }),
        [id]
    )
    const setRecordingState = useGlobalStateMutation(
        setRecordingStateMutationCreator
    )

    const removeRecordingStateMutationCreator = useCallback(
        () => (state: any) => {
            const recordingStates = { ...state.recordingStates }
            delete recordingStates[id]
            return { ...state, recordingStates }
        },
        [id]
    )
    const removeRecordingState = useGlobalStateMutation(
        removeRecordingStateMutationCreator
    )

    return useMemo(
        () => ({
            recordingState,
            setRecordingState,
            removeRecordingState,
        }),
        [recordingState, setRecordingState, removeRecordingState]
    )
}

/**
 * Returns a function that syncs cached sections in the global state
 * with IndexedDB, so that IndexedDB is the single source of truth
 *
 * @returns {Function} syncCachedSections
 */
function useSyncCachedSections() {
    const offlineInterface = useOfflineInterface()

    const setCachedSectionsMutationCreator = useCallback<
        GlobalStateStoreMutationCreator<CachedSectionsById>
    >(
        (cachedSections) => (state: any) => ({
            ...state,
            cachedSections,
        }),
        []
    )
    const setCachedSections = useGlobalStateMutation(
        setCachedSectionsMutationCreator
    )

    return useCallback(async () => {
        const sections = await offlineInterface.getCachedSections()
        setCachedSections(getSectionsById(sections))
    }, [offlineInterface, setCachedSections])
}

interface CachedSectionsControls {
    cachedSections: CachedSectionsById
    removeById: (id: string) => Promise<boolean>
    syncCachedSections: () => Promise<void>
}

/**
 * Uses global state to manage an object of cached sections' statuses
 *
 * @returns {Object} { cachedSections: Object, removeSection: Function }
 */
export function useCachedSections(): CachedSectionsControls {
    const [cachedSections] = useGlobalState((state) => state.cachedSections)
    const syncCachedSections = useSyncCachedSections()
    const offlineInterface = useOfflineInterface()

    /**
     * Uses offline interface to remove a section from IndexedDB and Cache
     * Storage.
     *
     * Returns a promise that resolves to `true` if a section is found and
     * deleted, or `false` if asection with the specified ID does not exist.
     */
    const removeById = useCallback(
        async (id: string) => {
            const success = await offlineInterface.removeSection(id)
            if (success) {
                await syncCachedSections()
            }
            return success
        },
        [offlineInterface, syncCachedSections]
    )

    return useMemo(
        () => ({
            cachedSections,
            removeById,
            syncCachedSections,
        }),
        [cachedSections, removeById, syncCachedSections]
    )
}

interface CachedSectionControls {
    lastUpdated: Date
    isCached: boolean
    remove: () => Promise<boolean>
    syncCachedSections: () => Promise<void>
}

/**
 * Uses global state to manage the cached status of just one section, which
 * prevents unnecessary rerenders of consuming components
 *
 * @param {String} id
 * @returns {Object} { lastUpdated: Date, remove: Function }
 */
export function useCachedSection(id: string): CachedSectionControls {
    const [status] = useGlobalState((state) => state.cachedSections[id])
    const syncCachedSections = useSyncCachedSections()
    const offlineInterface = useOfflineInterface()

    const lastUpdated = status && status.lastUpdated

    /**
     * Uses offline interface to remove a section from IndexedDB and Cache
     * Storage.
     *
     * Returns `true` if a section is found and deleted, or `false` if a
     * section with the specified ID does not exist.
     */
    const remove = useCallback(async () => {
        const success = await offlineInterface.removeSection(id)
        if (success) {
            await syncCachedSections()
        }
        return success
    }, [offlineInterface, id, syncCachedSections])

    return useMemo(
        () => ({
            lastUpdated,
            isCached: !!lastUpdated,
            remove,
            syncCachedSections,
        }),
        [lastUpdated, remove, syncCachedSections]
    )
}
