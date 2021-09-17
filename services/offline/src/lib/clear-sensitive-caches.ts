// IndexedDB names; should be the same as in @dhis2/pwa
export const SECTIONS_DB = 'sections-db'
export const SECTIONS_STORE = 'sections-store'

// Non-sensitive caches that can be kept:
const KEEPABLE_CACHES = [
    /^workbox-precache/, // precached static assets
    /^other-assets/, // static assets cached at runtime - shouldn't be sensitive
]

declare global {
    interface IDBFactory {
        databases(): Promise<[{ name: string; version: number }]>
    }
}

/*
 * Clears the 'sections-db' IndexedDB if it exists. Designed to avoid opening
 * a new DB if it doesn't exist yet. Firefox can't check if 'sections-db'
 * exists, in which circumstance the IndexedDB is unaffected. It's inelegant
 * but acceptable because the IndexedDB has no sensitive data (only metadata
 * of recorded sections), and the OfflineInterface handles discrepancies
 * between CacheStorage and IndexedDB.
 */
const clearDB = async (dbName: string): Promise<void> => {
    if (!('databases' in indexedDB)) {
        // FF does not have indexedDB.databases. For that, just clear caches,
        // and offline interface will handle discrepancies in PWA apps.
        return
    }

    const dbs = await window.indexedDB.databases()
    if (!dbs.some(({ name }) => name === dbName)) {
        // Sections-db is not created; nothing to do here
        return
    }

    return new Promise((resolve, reject) => {
        // IndexedDB fun:
        const openDBRequest = indexedDB.open(dbName)
        openDBRequest.onsuccess = e => {
            const db = (e.target as IDBOpenDBRequest).result
            const tx = db.transaction(SECTIONS_STORE, 'readwrite')
            // When the transaction completes is when the operation is done:
            tx.oncomplete = () => resolve()
            tx.onerror = e => reject((e.target as IDBRequest).error)
            const os = tx.objectStore(SECTIONS_STORE)
            const clearReq = os.clear()
            clearReq.onerror = e => reject((e.target as IDBRequest).error)
        }
        openDBRequest.onerror = e => {
            reject((e.target as IDBOpenDBRequest).error)
        }
    })
}

/**
 * Used to clear caches and 'sections-db' IndexedDB when a user logs out or a
 * different user logs in to prevent someone from accessing a different user's
 * caches. Should be able to be used in a non-PWA app.
 */
export async function clearSensitiveCaches(
    dbName: string = SECTIONS_DB
): Promise<any> {
    console.debug('Clearing sensitive caches')

    const cacheKeys = await caches.keys()
    return Promise.all([
        // (Resolves to 'false' because this can't detect if anything was deleted):
        clearDB(dbName).then(() => false),
        // Remove caches if not in keepable list
        ...cacheKeys.map(key => {
            if (!KEEPABLE_CACHES.some(pattern => pattern.test(key))) {
                return caches.delete(key)
            }
            return false
        }),
    ]).then(responses => {
        // Return true if any caches have been cleared
        // (caches.delete() returns true if a cache is deleted successfully)
        // PWA apps can reload to restore their app shell cache
        return responses.some(response => response)
    })
}
