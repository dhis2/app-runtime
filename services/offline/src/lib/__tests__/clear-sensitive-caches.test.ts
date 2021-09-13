import FDBFactory from 'fake-indexeddb/lib/FDBFactory'
import { openDB } from 'idb'
import 'fake-indexeddb/auto'
import {
    clearSensitiveCaches,
    SECTIONS_DB,
    SECTIONS_STORE,
} from '../clear-sensitive-caches'

// Mocks for CacheStorage API

const keysMockDefault = jest.fn().mockImplementation(async () => [])
const deleteMockDefault = jest.fn().mockImplementation(async () => null)
const cachesDefault = {
    keys: keysMockDefault,
    delete: deleteMockDefault,
}
window.caches = cachesDefault

afterEach(() => {
    window.caches = cachesDefault
    jest.clearAllMocks()
})

// silence debug logs for these tests
const originalDebug = console.debug
beforeAll(() => {
    jest.spyOn(console, 'debug').mockImplementation((...args) => {
        const pattern = /Clearing sensitive caches/
        if (typeof args[0] === 'string' && pattern.test(args[0])) {
            return
        }
        return originalDebug.call(console, ...args)
    })
})
afterAll(() => {
    ;(console.debug as jest.Mock).mockRestore()
})

it('does not fail if there are no caches or no sections-db', () => {
    return expect(clearSensitiveCaches()).resolves.toBeDefined()
})

it('clears potentially sensitive caches', async () => {
    const keysMock = jest
        .fn()
        .mockImplementation(async () => ['cache1', 'cache2'])
    window.caches = { ...cachesDefault, keys: keysMock }

    await clearSensitiveCaches()

    expect(deleteMockDefault).toHaveBeenCalledTimes(2)
    expect(deleteMockDefault.mock.calls[0][0]).toBe('cache1')
    expect(deleteMockDefault.mock.calls[1][0]).toBe('cache2')
})

it('preserves keepable caches', async () => {
    const keysMock = jest
        .fn()
        .mockImplementation(async () => [
            'cache1',
            'cache2',
            'app-shell',
            'other-assets',
            'workbox-precache-v2-https://hey.howareya.now/',
        ])
    window.caches = { ...cachesDefault, keys: keysMock }

    await clearSensitiveCaches()

    expect(deleteMockDefault).toHaveBeenCalledTimes(2)
    expect(deleteMockDefault.mock.calls[0][0]).toBe('cache1')
    expect(deleteMockDefault.mock.calls[1][0]).toBe('cache2')
    expect(deleteMockDefault).not.toHaveBeenCalledWith('app-shell')
    expect(deleteMockDefault).not.toHaveBeenCalledWith('other-assets')
    expect(deleteMockDefault).not.toHaveBeenCalledWith(
        'workbox-precache-v2-https://hey.howareya.now/'
    )
})

describe('clears sections-db', () => {
    // Test DB
    function openTestDB(dbName: string) {
        // simplified version of app platform openDB logic
        return openDB(dbName, 1, {
            upgrade(db) {
                db.createObjectStore(SECTIONS_STORE, { keyPath: 'sectionId' })
            },
        })
    }

    afterEach(() => {
        // reset indexedDB state
        window.indexedDB = new FDBFactory()
    })

    it('clears sections-db if it exists', async () => {
        // Open and populate test DB
        const db = await openTestDB(SECTIONS_DB)
        await db.put(SECTIONS_STORE, {
            sectionId: 'id-1',
            lastUpdated: new Date(),
            requests: 3,
        })
        await db.put(SECTIONS_STORE, {
            sectionId: 'id-2',
            lastUpdated: new Date(),
            requests: 3,
        })

        await clearSensitiveCaches()

        // Sections-db should be cleared
        const allSections = await db.getAll(SECTIONS_STORE)
        expect(allSections).toHaveLength(0)
    })

    it("doesn't clear sections-db if it doesn't exist and doesn't open a new one", async () => {
        const openMock = jest.fn()
        window.indexedDB.open = openMock

        expect(await indexedDB.databases()).not.toContain(SECTIONS_DB)

        await clearSensitiveCaches()

        expect(openMock).not.toHaveBeenCalled()
        return expect(await indexedDB.databases()).not.toContain(SECTIONS_DB)
    })

    it("doesn't handle IDB if 'databases' property is not on window.indexedDB", async () => {
        // Open DB -- 'indexedDB.open' _would_ get called in this test
        // if 'databases' property exists
        await openTestDB(SECTIONS_DB)
        const openMock = jest.fn()
        window.indexedDB.open = openMock

        // Remove 'databases' from indexedDB prototype for this test
        // (simulates Firefox environment)
        const idbProto = Object.getPrototypeOf(window.indexedDB)
        const databases = idbProto.databases
        delete idbProto.databases

        expect('databases' in window.indexedDB).toBe(false)
        await expect(clearSensitiveCaches()).resolves.toBeDefined()
        expect(openMock).not.toHaveBeenCalled()

        // Restore indexedDB prototype for later tests
        idbProto.databases = databases
        expect('databases' in window.indexedDB).toBe(true)
    })
})
