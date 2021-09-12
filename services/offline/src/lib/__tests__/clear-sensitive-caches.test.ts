// import { openDB } from 'idb'
import 'fake-indexeddb/auto'
import { clearSensitiveCaches } from '../clear-sensitive-caches'

const keysMockDefault = jest.fn().mockImplementation(async () => [])
const deleteMockDefault = jest.fn().mockImplementation(async () => null)
const cachesDefault = {
    keys: keysMockDefault,
    delete: deleteMockDefault,
}
window.caches = cachesDefault

// todo: set up DB for tests; tear down when necessary
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

// todo: remove after test db is set up
test('mocks exists', () => {
    expect(indexedDB).toBeDefined()
    expect(window.indexedDB).toBeDefined()
    expect('databases' in window.indexedDB).toBe(true)
    expect(window.caches).toBeDefined()
})

it('does not fail if there are no caches or no sections-db', () => {
    expect(async () => await clearSensitiveCaches()).not.toThrow()
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

// todo:
it.todo('clears sections-db if it exists')
it.todo(
    "doesn't clear sections-db if it doesn't exist and doesn't open a new one"
)
it.todo("doesn't handle IDB if 'databases' property is not on window.indexedDB")
