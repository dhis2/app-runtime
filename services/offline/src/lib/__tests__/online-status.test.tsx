import { act, renderHook } from '@testing-library/react-hooks'
import { useOnlineStatus } from '../online-status'

interface CapturedEventListeners {
    [index: string]: EventListener
}

beforeEach(() => {
    jest.restoreAllMocks()
})

describe('initalizes to navigator.onLine value', () => {
    it('initializes to true', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const { result } = renderHook(() => useOnlineStatus())

        expect(result.current.online).toBe(true)
        expect(result.current.offline).toBe(false)
    })

    it('initializes to false', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const { result } = renderHook(() => useOnlineStatus())

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)
    })
})

describe('state changes in response to browser "online" and "offline" events', () => {
    it('switches from online to offline when the "offline" event triggers', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        // Capture callback to trigger later using addEventListener mock
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 50 } }
        )

        act(() => {
            // Trigger callback captured by addEventListener mock
            events.offline(new Event('offline'))
        })

        // Wait for debounce
        await waitForNextUpdate({ timeout: 60 })

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)
    })

    it('switches from offline to online when the "online" event triggers', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 50 } }
        )

        act(() => {
            events.online(new Event('online'))
        })

        // Wait for debounce
        await waitForNextUpdate({ timeout: 60 })

        expect(result.current.online).toBe(true)
        expect(result.current.offline).toBe(false)
    })
})

describe('debouncing state changes', () => {
    it('debounces with a 1s delay', async () => {
        // Start online
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(() =>
            useOnlineStatus()
        )

        await act(async () => {
            // Multiple events in succession
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // Immediately, nothing should happen
        expect(result.current.online).toBe(true)

        // 1s later, final 'offline' event should resolve
        await waitForNextUpdate({ timeout: 1009 })
        expect(result.current.online).toBe(false)
    })

    it('can have debounce delay set to another number', async () => {
        // Start online
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 50 } }
        )

        await act(async () => {
            // Multiple events in succession
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // Immediately, nothing should happen
        expect(result.current.online).toBe(true)

        // 50ms later, final "offline" event should finally resolve
        await waitForNextUpdate({ timeout: 60 })
        expect(result.current.online).toBe(false)
    })

    it('can have the debounce delay changed during its lifecycle', async () => {
        // Start with 150 ms debounce
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate, rerender } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 150 } }
        )

        await act(async () => {
            // Multiple events in succession
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // Immediately, nothing should happen
        expect(result.current.online).toBe(true)

        // 150ms later, final "offline" event should finally resolve
        await waitForNextUpdate({ timeout: 160 })
        expect(result.current.online).toBe(false)

        // Change to 50 ms debounce
        rerender({ debounceDelay: 50 })

        await act(async () => {
            // Multiple events in succession
            events.online(new Event('online'))
            events.offline(new Event('offline'))
            events.online(new Event('online'))
        })

        // Immediately, nothing should happen
        expect(result.current.online).toBe(false)

        // 50ms later, final "online" event should finally resolve
        await waitForNextUpdate({ timeout: 60 })
        expect(result.current.online).toBe(true)
    })
})
