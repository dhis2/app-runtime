import { act, renderHook } from '@testing-library/react-hooks'
import { useOnlineStatus } from '../online-status'

beforeEach(() => {
    jest.restoreAllMocks()
})

describe('initalizes to navigator.onLine value', () => {
    it('initializes to true', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const { result } = renderHook((...args) => useOnlineStatus(...args))

        expect(result.current.online).toBe(true)
        expect(result.current.offline).toBe(false)
    })

    it('initializes to false', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const { result } = renderHook((...args) => useOnlineStatus(...args))

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)
    })
})

describe('state changes in response to browser "online" and "offline" events', () => {
    it('switches from online to offline when the "offline" event triggers', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        // Capture callback to trigger later using addEventListener mock
        const events = {}
        window.addEventListener = jest.fn((event, cb) => (events[event] = cb))
        const { result } = renderHook((...args) => useOnlineStatus(...args))

        act(() => {
            // Trigger callback captured by addEventListener mock
            events.offline({ type: 'offline' })
        })

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)
    })

    it('switches from offline to online when the "offline" event triggers', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const events = {}
        window.addEventListener = jest.fn((event, cb) => (events[event] = cb))
        const { result } = renderHook((...args) => useOnlineStatus(...args))

        act(() => {
            events.online({ type: 'online' })
        })

        expect(result.current.online).toBe(true)
        expect(result.current.offline).toBe(false)
    })
})

describe('debouncing state changes', () => {
    it('debounces with a 1s delay by default', async () => {
        // Start online
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events = {}
        window.addEventListener = jest.fn((event, cb) => (events[event] = cb))
        const { result, waitForNextUpdate } = renderHook((...args) =>
            useOnlineStatus(...args)
        )

        await act(async () => {
            // Multiple events in succession
            events.offline({ type: 'offline' })
            events.online({ type: 'online' })
            events.offline({ type: 'offline' })
            events.online({ type: 'online' })
        })

        // Immediately, only the offline should have triggered
        expect(result.current.online).toBe(false)

        // 1s later, final "online" event should finally resolve
        await waitForNextUpdate({ timeout: 1000 })
        expect(result.current.online).toBe(true)
    })

    it('can have debounce delay set to another number', async () => {
        // Start online
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events = {}
        window.addEventListener = jest.fn((event, cb) => (events[event] = cb))
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 50 } }
        )

        await act(async () => {
            // Multiple events in succession
            events.offline({ type: 'offline' })
            events.online({ type: 'online' })
            events.offline({ type: 'offline' })
            events.online({ type: 'online' })
        })

        // Immediately, only the offline should have triggered
        expect(result.current.online).toBe(false)

        // 50ms later, final "online" event should finally resolve
        await waitForNextUpdate({ timeout: 50 })
        expect(result.current.online).toBe(true)
    })
})
