import PropTypes from 'prop-types'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useOfflineInterface } from './offline-interface'

const CachedSectionsContext = createContext()

/**
 * Uses the offline interface to access a Map of cached section IDs to their
 * last updated time. Provides that list, a 'removeSection(id)' function, and
 * an 'updateSections' function as context.
 *
 * TODO: Will be refactored to a mutable state model that will prevent context
 * consumers from rerendering every time the state changes. Will also be
 * combined with `RecordingStates` context.
 */
export function CachedSectionsProvider({ children }) {
    const offlineInterface = useOfflineInterface()

    // cachedSections: Map: id => lastUpdated
    const [cachedSections, setCachedSections] = useState(new Map())

    // Populate cached sections on load
    useEffect(() => {
        if (offlineInterface.pwaEnabled) updateSections()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    /** Syncs state with contents of IndexedDB using offline interface */
    async function updateSections() {
        try {
            const list = await offlineInterface.getCachedSections()
            // Convert list to a map for easy lookup
            const map = new Map()
            list.forEach(section =>
                map.set(section.sectionId, section.lastUpdated)
            )
            setCachedSections(map)
        } catch (error) {
            // Add a descriptive message before throwing
            error.message = `There was an error when attempting to update cached sections: ${error.message}`
            throw error
        }
    }

    /**
     * Uses offline interface to remove a section from IndexedDB and Cache
     * Storage.
     *
     * Returns `true` if a section is found and deleted, or `false` if a
     * section with the specified ID does not exist.
     */
    async function removeSection(id) {
        try {
            const success = await offlineInterface.removeSection(id)
            if (success) updateSections()
            return success
        } catch (error) {
            error.message = `There was an error when trying to remove this section: ${error.message}`
            throw error
        }
    }

    const context = {
        cachedSections,
        removeSection,
        updateSections,
    }

    return (
        <CachedSectionsContext.Provider value={context}>
            {children}
        </CachedSectionsContext.Provider>
    )
}

CachedSectionsProvider.propTypes = {
    children: PropTypes.node,
}

/**
 * Access info and operations related to _all_ cached sections.
 * @returns {Object} { cachedSections: Map, removeSection: func(id), updateSections: func() }
 */
export function useCachedSections() {
    const context = useContext(CachedSectionsContext)

    if (context === undefined) {
        throw new Error(
            'useCachedSections must be used within a CachedSectionsProvider'
        )
    }

    return context
}

/**
 * Accesses info and operations related to _a single_ cached section.
 * @param {string} id - Section ID of a cached section
 * @returns {Object} { isCached: boolean, lastUpdated: Date, remove: func(), updateSections: func() }
 */
export function useCachedSection(id) {
    const context = useContext(CachedSectionsContext)

    if (context === undefined) {
        throw new Error(
            'useCachedSection must be used within a CachedSectionsProvider'
        )
    }

    const { cachedSections, removeSection, updateSections } = context

    const lastUpdated = cachedSections.get(id) // might be undefined
    const isCached = !!lastUpdated
    const remove = () => removeSection(id)

    return {
        isCached,
        lastUpdated,
        remove,
        updateSections,
    }
}
