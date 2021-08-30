import { render, screen, waitFor } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useOnlineStatus } from '../online-status'

interface CapturedEventListeners {
    [index: string]: EventListener
}

function wait(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

beforeEach(() => {
    jest.restoreAllMocks()
})

afterEach(() => {
    localStorage.clear()
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
    it('debounces with a 1s delay by default', async () => {
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

    it('can use a debounceDelay of 0 to skip debouncing', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            {
                initialProps: { debounceDelay: 0 },
            }
        )
        await act(async () => {
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // await wait(0) didn't work here
        await waitForNextUpdate({ timeout: 0 })

        // There should be no delay before status is offline
        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)
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

    it('handles debounced state change when parent component rerenders during a debounce delay', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )

        const TestComponent = () => {
            const { online } = useOnlineStatus({ debounceDelay: 50 })
            return <div data-testid="status">{online ? 'on' : 'off'}</div>
        }
        const { rerender } = render(<TestComponent />)

        const { getByTestId } = screen
        expect(getByTestId('status')).toHaveTextContent('on')

        await act(async () => {
            // Multiple events in succession
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // Immediately, nothing should happen
        expect(getByTestId('status')).toHaveTextContent('on')

        // Rerender parent component
        rerender(<TestComponent />)

        // Final "offline" event should still resolve
        await waitFor(() =>
            expect(getByTestId('status')).toHaveTextContent('off')
        )
    })

    it('handles debounced state change when debounce delay is changed during a delay', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )

        const TestComponent = ({ options }: { options?: any }) => {
            const { online } = useOnlineStatus(options)
            return <div data-testid="status">{online ? 'on' : 'off'}</div>
        }
        const { rerender } = render(
            <TestComponent options={{ debounceDelay: 100 }} />
        )

        const { getByTestId } = screen
        expect(getByTestId('status')).toHaveTextContent('on')

        await act(async () => {
            // Multiple events in succession
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // Immediately, nothing should happen
        expect(getByTestId('status')).toHaveTextContent('on')

        // Change debounce options
        rerender(<TestComponent options={{ debounceDelay: 50 }} />)

        // Final "offline" event should still resolve
        await waitFor(() =>
            expect(getByTestId('status')).toHaveTextContent('off')
        )
    })

    it('debounces consistently across rerenders', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )

        const TestComponent = () => {
            const { online } = useOnlineStatus({ debounceDelay: 100 })
            return <div data-testid="status">{online ? 'on' : 'off'}</div>
        }
        const { rerender } = render(<TestComponent />)

        const { getByTestId } = screen
        expect(getByTestId('status')).toHaveTextContent('on')

        await act(async () => {
            // Multiple events in succession
            events.offline(new Event('offline'))
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // wait a little bit - not long enough for debounce to resolve
        await wait(50)
        expect(getByTestId('status')).toHaveTextContent('on')

        // Rerender parent component
        rerender(<TestComponent />)

        // Trigger more events
        await act(async () => {
            events.online(new Event('online'))
            events.offline(new Event('offline'))
        })

        // wait a little more - long enough that the first debounced callbacks
        // _would_ have resolved if there weren't the second set of events
        await wait(60)
        expect(getByTestId('status')).toHaveTextContent('on')

        // wait long enough for second set of callbacks to resolve
        await waitFor(() =>
            expect(getByTestId('status')).toHaveTextContent('off')
        )
    })
})

describe('it updates the lastOnline value in local storage', () => {
    const lastOnlineKey = 'dhis2.lastOnline'
    const testDateString = 'Fri, 27 Aug 2021 19:53:06 GMT'

    it('sets lastOnline in local storage when it goes offline', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 0 } }
        )

        // Correct initial state
        expect(localStorage.getItem(lastOnlineKey)).toBe(null)
        expect(result.current.lastOnline).toBe(null)

        act(() => {
            events.offline(new Event('offline'))
        })

        // Wait for debounce
        await waitForNextUpdate({ timeout: 0 })

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)

        // Check localStorage for a stored date
        const parsedDate = new Date(
            localStorage.getItem(lastOnlineKey) as string
        )
        expect(parsedDate.toString()).not.toBe('Invalid Date')
        // Check hook return value
        expect(result.current.lastOnline).toBeInstanceOf(Date)
        expect(result.current.lastOnline?.toUTCString()).toBe(
            localStorage.getItem(lastOnlineKey)
        )
    })

    it("doesn't change lastOnline it exists and if it's already offline", async () => {
        // seed localStorage
        localStorage.setItem(lastOnlineKey, testDateString)
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result } = renderHook((...args) => useOnlineStatus(...args), {
            initialProps: { debounceDelay: 0 },
        })

        expect(localStorage.getItem(lastOnlineKey)).toBe(testDateString)
        expect(result.current.lastOnline).toEqual(new Date(testDateString))

        act(() => {
            events.offline(new Event('offline'))
        })

        await wait(0)

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)

        expect(localStorage.getItem(lastOnlineKey)).toBe(testDateString)
        expect(result.current.lastOnline).toEqual(new Date(testDateString))
    })

    it('clears lastOnline when it goes online', async () => {
        // seed localStorage
        localStorage.setItem(lastOnlineKey, testDateString)
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            {
                initialProps: { debounceDelay: 0 },
            }
        )

        expect(localStorage.getItem(lastOnlineKey)).toBe(testDateString)
        expect(result.current.lastOnline).toEqual(new Date(testDateString))

        act(() => {
            events.offline(new Event('online'))
        })

        // Wait for debounce
        await waitForNextUpdate({ timeout: 0 })

        expect(result.current.online).toBe(true)
        expect(result.current.offline).toBe(false)

        // expect(localStorage.getItem(lastOnlineKey)).toBe(null)
        expect(result.current.lastOnline).toBe(null)
    })

    it('tracks correctly when going offline and online', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const events: CapturedEventListeners = {}
        window.addEventListener = jest.fn(
            (event, cb) => (events[event] = cb as EventListener)
        )
        const { result, waitForNextUpdate } = renderHook(
            (...args) => useOnlineStatus(...args),
            { initialProps: { debounceDelay: 0 } }
        )

        // Correct initial state
        expect(localStorage.getItem(lastOnlineKey)).toBe(null)
        expect(result.current.lastOnline).toBe(null)

        act(() => {
            events.offline(new Event('offline'))
        })
        await waitForNextUpdate({ timeout: 0 })

        const firstDate = new Date(
            localStorage.getItem(lastOnlineKey) as string
        )
        const firstValue = result.current.lastOnline?.valueOf()

        act(() => {
            events.offline(new Event('online'))
        })
        await waitForNextUpdate({ timeout: 0 })

        expect(result.current.lastOnline).toBe(null)

        // todo: this is an error from UTC strings' imprecision
        await wait(1000)

        act(() => {
            events.offline(new Event('offline'))
        })
        await waitForNextUpdate({ timeout: 0 })

        expect(
            new Date(localStorage.getItem(lastOnlineKey) as string)
        ).not.toEqual(firstDate)
        expect(result.current.lastOnline?.valueOf()).not.toEqual(firstValue)
    })
})
