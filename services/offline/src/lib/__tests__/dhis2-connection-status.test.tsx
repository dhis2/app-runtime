import { ConfigProvider } from '@dhis2/app-service-config'
import { CustomDataProvider } from '@dhis2/app-service-data'
import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { mockOfflineInterface } from '../../utils/test-mocks'
import {
    getLastConnectedKey,
    useDhis2ConnectionStatus,
} from '../dhis2-connection-status'
import { OfflineProvider } from '../offline-provider'
import {
    DEFAULT_INCREMENT_FACTOR,
    DEFAULT_MAX_DELAY_MS,
    DEFAULT_INITIAL_DELAY_MS,
} from '../smart-interval'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { usePingQuery } from '../use-ping-query'

// important that this name starts with 'mock' to be hoisted correctly
const mockPing = jest.fn().mockImplementation(() => Promise.resolve())

jest.mock('../use-ping-query.ts', () => ({
    usePingQuery: () => mockPing,
}))

const failedPing = () =>
    Promise.reject({
        message: 'this is a network error',
        type: 'network',
    })

const FIRST_INTERVAL_MS = DEFAULT_INITIAL_DELAY_MS
const SECOND_INTERVAL_MS = FIRST_INTERVAL_MS * DEFAULT_INCREMENT_FACTOR
const THIRD_INTERVAL_MS = SECOND_INTERVAL_MS * DEFAULT_INCREMENT_FACTOR
const FOURTH_INTERVAL_MS = THIRD_INTERVAL_MS * DEFAULT_INCREMENT_FACTOR

// Explanation: The length of the Nth interval is:
// initialDelay * incrementFactor ^ (N - 1)
// Using some algebra and the law of logs, the Nth interval
// which is longer than the max delay is:
// N >= (ln (maxDelay / initialDelay) / ln (incrementFactor)) + 1
// => then use Math.ceil to handle the 'greater than' effect
const INTERVALS_TO_REACH_MAX_DELAY = Math.ceil(
    Math.log(DEFAULT_MAX_DELAY_MS / DEFAULT_INITIAL_DELAY_MS) /
        Math.log(DEFAULT_INCREMENT_FACTOR) +
        1
)

const wrapper: React.FC = ({ children }) => (
    <CustomDataProvider data={{}}>
        <OfflineProvider offlineInterface={mockOfflineInterface}>
            {children}
        </OfflineProvider>
    </CustomDataProvider>
)

/**
 * Assert on the delay of the last time setTimeoutSpy was called with
 * the `callbackAndRestart()` function in smartInterval.
 *
 * This is useful because sometimes jest (or something) uses `setTimeout`
 * too with a `_flushCallback` function, which gets in the way of using
 * an assertion like:
 * `expect(setTimeoutSpy).toHaveBeenLastCalledWith(..., expectedDelay)`
 */
const assertLastDelay = (
    setTimeoutSpy: jest.SpyInstance,
    expectedDelay: number
) => {
    const calls = setTimeoutSpy.mock.calls
    for (let i = calls.length - 1; i >= 0; i--) {
        if (calls[i][0].name === 'callbackAndRestart') {
            expect(calls[i][1]).toBe(expectedDelay)
            return
        }
    }
}

const testCurrentDate = new Date('Fri, 03 Feb 2023 13:52:31 GMT')
beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(Date, 'now').mockReturnValue(testCurrentDate.getTime())
})
beforeEach(() => {
    // standby state is initialized to window visibility, which is 'false' by
    // default in tests. mock that here:
    jest.spyOn(document, 'hasFocus').mockReturnValue(true)
})
afterEach(() => {
    jest.clearAllMocks()
    // for lastConnected:
    localStorage.clear()
})
afterAll(() => {
    jest.useRealTimers()
    jest.resetAllMocks()
})

describe('initialization to the right values based on offline interface', () => {
    test('when latestIsConnected is true', () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        expect(result.current.isConnected).toBe(true)
        expect(result.current.isDisconnected).toBe(false)
        expect(result.current.lastConnected).toBe(null)
    })

    test('when latestIsConnected is false', () => {
        const customMockOfflineInterface = {
            ...mockOfflineInterface,
            latestIsConnected: false,
        }
        const customWrapper: React.FC = ({ children }) => (
            <CustomDataProvider data={{}}>
                <OfflineProvider offlineInterface={customMockOfflineInterface}>
                    {children}
                </OfflineProvider>
            </CustomDataProvider>
        )
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: customWrapper,
        })

        expect(result.current.isConnected).toBe(false)
        expect(result.current.isDisconnected).toBe(true)
        // If localStorage is clear, sets 'lastConnected' to `now` as a best
        // effort to provide useful information.
        // There will be more detailed testing of lastConnected below
        expect(result.current.lastConnected).toEqual(testCurrentDate)
    })

    // This might happen in the unlikely circumstance that the provider
    // renders before the offlineInterface has received a value for
    // lastIsConnected. Normally, the ServerVersionProvider in the app
    // adapter delays rendering the App Runtime provider (including the
    // OfflineProvider) until the offline interface is ready, which should
    // avoid this case.
    test('when latestIsConnected is null', () => {
        const customMockOfflineInterface = {
            ...mockOfflineInterface,
            latestIsConnected: null,
        }
        const customWrapper: React.FC = ({ children }) => (
            <CustomDataProvider data={{}}>
                <OfflineProvider offlineInterface={customMockOfflineInterface}>
                    {children}
                </OfflineProvider>
            </CustomDataProvider>
        )
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: customWrapper,
        })

        expect(result.current.isConnected).toBe(false)
        expect(result.current.isDisconnected).toBe(true)
        expect(result.current.lastConnected).toEqual(testCurrentDate)
    })
})

describe('interval behavior', () => {
    test('the ping delay increases when idle until the max is reached', async () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout')

        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        expect(result.current.isConnected).toBe(true)
        expect(mockPing).not.toHaveBeenCalled()
        assertLastDelay(setTimeoutSpy, FIRST_INTERVAL_MS)

        // 500ms before first interval
        jest.advanceTimersByTime(FIRST_INTERVAL_MS - 500)
        expect(mockPing).not.toHaveBeenCalled()
        // 500ms after first interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(1)
        assertLastDelay(setTimeoutSpy, SECOND_INTERVAL_MS)

        // 500ms before second interval
        jest.advanceTimersByTime(SECOND_INTERVAL_MS - 1000)
        expect(mockPing).toHaveBeenCalledTimes(1)
        // 500ms after second interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(2)
        assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)

        // 500ms before third interval
        jest.advanceTimersByTime(THIRD_INTERVAL_MS - 1000)
        expect(mockPing).toHaveBeenCalledTimes(2)
        // 500ms after third interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(3)
        assertLastDelay(setTimeoutSpy, FOURTH_INTERVAL_MS)

        // Run a number of intervals to reach the max delay -
        // this number is calculated above to work for any default values.
        // Since three have already elapsed, there will be some extra too
        for (let i = 0; i < INTERVALS_TO_REACH_MAX_DELAY; i++) {
            // Wrap in act to await async side effects of interval execution
            // and pings
            await act(async () => {
                jest.runOnlyPendingTimers()
            })
        }

        // Timeout should no longer be incrementing; max has been reached
        expect(mockPing).toHaveBeenCalledTimes(3 + INTERVALS_TO_REACH_MAX_DELAY)
        assertLastDelay(setTimeoutSpy, DEFAULT_MAX_DELAY_MS)

        // Run a few more intervals to make sure it stays at max
        for (let i = 0; i < 3; i++) {
            await act(async () => {
                jest.runOnlyPendingTimers()
            })
        }

        // Expect continued use of the max delay
        expect(mockPing).toHaveBeenCalledTimes(6 + INTERVALS_TO_REACH_MAX_DELAY)
        assertLastDelay(setTimeoutSpy, DEFAULT_MAX_DELAY_MS)
    })

    describe('pings are delayed when offlineInterface sends status updates', () => {
        test('updates postpone pings', () => {
            renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: wrapper,
            })

            // get onUpdate function passed to mockOfflineInterface
            const { onUpdate } =
                mockOfflineInterface.subscribeToDhis2ConnectionStatus.mock
                    .calls[0][0]

            // invoke it at a few intervals, before pings are scheduled
            for (let i = 0; i < 3; i++) {
                jest.advanceTimersByTime(DEFAULT_INITIAL_DELAY_MS - 2000)
                onUpdate({ isConnected: true })
            }

            // expect ping mock not to have been called
            expect(mockPing).not.toHaveBeenCalled
        })

        test('if the status is the same, the ping delay is reset to the current', () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            renderHook(() => useDhis2ConnectionStatus(), { wrapper })

            // get onUpdate function passed to mockOfflineInterface
            const { onUpdate } =
                mockOfflineInterface.subscribeToDhis2ConnectionStatus.mock
                    .calls[0][0]

            // let two intervals pass to allow delay to increase
            jest.advanceTimersByTime(FIRST_INTERVAL_MS + 50)
            jest.advanceTimersByTime(SECOND_INTERVAL_MS)

            // ...delay should now be 'THIRD_INTERVAL_MS'
            assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)
            expect(mockPing).toHaveBeenCalledTimes(2)

            // simulate updates from the SW/offline interface several times
            // invoke it at a few intervals, before pings are scheduled
            for (let i = 0; i < 3; i++) {
                jest.advanceTimersByTime(THIRD_INTERVAL_MS - 2000)
                onUpdate({ isConnected: true })
            }

            // ping mock should STILL only have been called twice
            expect(mockPing).toHaveBeenCalledTimes(2)

            // the delay should still be THIRD_INTERVAL_MS
            assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)

            // The timer works as normal for the next tick --
            // 500ms before the fourth interval:
            jest.advanceTimersByTime(THIRD_INTERVAL_MS - 500)
            expect(mockPing).toHaveBeenCalledTimes(2)
            // 500ms after the fourth interval
            jest.advanceTimersByTime(1000)
            expect(mockPing).toHaveBeenCalledTimes(3)
        })
    })

    describe('the ping interval resets to initial if the detected connection status changes', () => {
        test('this happens when the offline interface issues an update', async () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            const { result } = renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: wrapper,
            })
            // get onUpdate function passed to mockOfflineInterface
            const { onUpdate } =
                mockOfflineInterface.subscribeToDhis2ConnectionStatus.mock
                    .calls[0][0]

            expect(result.current.isConnected).toBe(true)

            // Get to third interval
            // (Wrap in `act` to await async side effects of the executions)
            await act(async () => {
                jest.runOnlyPendingTimers()
                jest.runOnlyPendingTimers()
            })
            expect(mockPing).toHaveBeenCalledTimes(2)
            assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)

            // Trigger connection status change from offline interface
            await act(async () => {
                onUpdate({ isConnected: false })
            })

            // Expect "first interval delay" to be set up
            assertLastDelay(setTimeoutSpy, FIRST_INTERVAL_MS)
            expect(result.current.isConnected).toBe(false)

            // Mock an error for the next ping to maintain `isConnected: false`
            mockPing.mockImplementationOnce(() =>
                Promise.reject({
                    message: 'this is a network error',
                    type: 'network',
                })
            )
            // Advance past "first interval" -- make sure incrementing resumes
            // while still 'isConnected: false'
            await act(async () => {
                jest.advanceTimersByTime(FIRST_INTERVAL_MS + 50)
            })

            // Expect another execution with the incremented interval
            expect(mockPing).toHaveBeenCalledTimes(3)
            assertLastDelay(setTimeoutSpy, SECOND_INTERVAL_MS)
        })

        test('this happens if a ping detects a status change', async () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            const { result } = renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: wrapper,
            })

            expect(result.current.isConnected).toBe(true)

            // Get to third interval
            jest.runOnlyPendingTimers()
            jest.runOnlyPendingTimers()
            expect(mockPing).toHaveBeenCalledTimes(2)
            assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)

            // Mock a network error
            mockPing.mockImplementationOnce(() =>
                Promise.reject({
                    message: 'this is a network error',
                    type: 'network',
                })
            )

            await act(async () => {
                jest.advanceTimersByTime(THIRD_INTERVAL_MS + 50)
            })

            expect(result.current.isConnected).toBe(false)
            expect(mockPing).toHaveBeenCalledTimes(3)
            assertLastDelay(setTimeoutSpy, FIRST_INTERVAL_MS)
        })
    })
})

describe('pings aren\'t sent when the app is not focused; "standby behavior"', () => {
    test("it doesn't ping when the app loses focus and is never refocused", () => {
        renderHook(() => useDhis2ConnectionStatus(), { wrapper })

        window.dispatchEvent(new Event('blur'))

        // This recursively executes all timers -- if it's not in standby,
        // it will enter a loop
        jest.runAllTimers()

        expect(mockPing).not.toHaveBeenCalled()
    })

    test("it doesn't ping if the app is never focused (even upon startup)", () => {
        jest.spyOn(document, 'hasFocus').mockReturnValue(false)
        renderHook(() => useDhis2ConnectionStatus(), { wrapper })

        // This recursively executes all timers
        jest.runAllTimers()

        expect(mockPing).not.toHaveBeenCalled()
    })

    test('if the app is defocused and refocused between two pings, pings happen normally', () => {
        renderHook(() => useDhis2ConnectionStatus(), { wrapper })

        window.dispatchEvent(new Event('blur'))
        // wait half of the first interval
        jest.advanceTimersByTime(FIRST_INTERVAL_MS / 2)
        window.dispatchEvent(new Event('focus'))

        // wait for just over the second half of the first interval
        jest.advanceTimersByTime(FIRST_INTERVAL_MS / 2 + 50)

        // ping should execute normally
        expect(mockPing).toHaveBeenCalledTimes(1)
    })

    test('if the app is defocused until after a scheduled ping, that ping is not sent until the app is refocused', () => {
        renderHook(() => useDhis2ConnectionStatus(), { wrapper })

        window.dispatchEvent(new Event('blur'))

        // wait for twice the first interval
        jest.advanceTimersByTime(FIRST_INTERVAL_MS * 2)

        // no pings should be sent since it's in standby
        expect(mockPing).not.toHaveBeenCalled()

        // refocus the page
        window.dispatchEvent(new Event('focus'))

        // ping should execute immediately
        expect(mockPing).toHaveBeenCalledTimes(1)
    })
})

describe('it pings when an offline event is detected', () => {
    test('if the app is focused, it pings immediately', () => {
        renderHook(() => useDhis2ConnectionStatus(), { wrapper })

        window.dispatchEvent(new Event('offline'))

        // ping should execute immediately
        expect(mockPing).toHaveBeenCalledTimes(1)
    })

    test('if the app is not focused, it does not ping immediately, but pings immediately when refocused', () => {
        renderHook(() => useDhis2ConnectionStatus(), { wrapper })

        window.dispatchEvent(new Event('blur'))
        window.dispatchEvent(new Event('offline'))

        // ping should not execute, but should be queued for refocus
        expect(mockPing).toHaveBeenCalledTimes(0)

        // upon refocus, the ping should execute immediately
        // despite a full interval not elapsing
        window.dispatchEvent(new Event('focus'))
        expect(mockPing).toHaveBeenCalledTimes(1)
    })

    describe('interval handling when pinging upon refocusing after offline event is detected while not focused', () => {
        test('if the app is refocused before the next "scheduled" ping, the timeout to the next ping is not increased', () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            renderHook(() => useDhis2ConnectionStatus(), { wrapper })

            window.dispatchEvent(new Event('blur'))
            window.dispatchEvent(new Event('offline'))
            window.dispatchEvent(new Event('focus'))
            // upon refocus, the ping should execute immediately
            // despite a full interval not elapsing
            expect(mockPing).toHaveBeenCalledTimes(1)

            // The delay should be the initial again -- it shouldn't increment
            assertLastDelay(setTimeoutSpy, FIRST_INTERVAL_MS)
        })

        test('same as previous, but interval is reset if status changes', async () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            const { result } = renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: wrapper,
            })

            expect(result.current.isConnected).toBe(true)

            // Get to third interval
            jest.runOnlyPendingTimers()
            jest.runOnlyPendingTimers()
            expect(mockPing).toHaveBeenCalledTimes(2)
            assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)

            // Mock a network error
            mockPing.mockImplementationOnce(() =>
                Promise.reject({
                    message: 'this is a network error',
                    type: 'network',
                })
            )

            // Blur, trigger 'offline' event, and refocus to trigger a ping
            window.dispatchEvent(new Event('blur'))
            window.dispatchEvent(new Event('offline'))
            await act(async () => {
                window.dispatchEvent(new Event('focus'))
            })

            expect(result.current.isConnected).toBe(false)
            expect(mockPing).toHaveBeenCalledTimes(3)
            assertLastDelay(setTimeoutSpy, FIRST_INTERVAL_MS)
        })

        test('if the app is refocused after the next "scheduled" ping, increase the interval to the next ping if the status hasn\'t changed', () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            renderHook(() => useDhis2ConnectionStatus(), { wrapper })

            window.dispatchEvent(new Event('blur'))
            window.dispatchEvent(new Event('offline'))

            // Elapse twice one interval - it should enter full standby
            jest.advanceTimersByTime(FIRST_INTERVAL_MS * 2)
            expect(mockPing).toHaveBeenCalledTimes(0)

            // Refocusing should trigger a ping from the full standby,
            // not just the offline event
            window.dispatchEvent(new Event('focus'))
            expect(mockPing).toHaveBeenCalledTimes(1)

            // The delay should increment this time, as it would from normal standby
            assertLastDelay(setTimeoutSpy, SECOND_INTERVAL_MS)
        })

        test('the same as previous, but the interval is reset if status has changed', async () => {
            const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
            const { result } = renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: wrapper,
            })

            expect(result.current.isConnected).toBe(true)

            // Get to third interval
            jest.runOnlyPendingTimers()
            jest.runOnlyPendingTimers()
            expect(mockPing).toHaveBeenCalledTimes(2)
            assertLastDelay(setTimeoutSpy, THIRD_INTERVAL_MS)

            // Blur and elapse twice the third interval --
            // it should enter full standby
            window.dispatchEvent(new Event('blur'))
            window.dispatchEvent(new Event('offline'))
            jest.advanceTimersByTime(THIRD_INTERVAL_MS * 2)

            // Mock a network error for the next ping
            mockPing.mockImplementationOnce(() =>
                Promise.reject({
                    message: 'this is a network error',
                    type: 'network',
                })
            )

            // Trigger a ping by refocusing
            await act(async () => {
                window.dispatchEvent(new Event('focus'))
            })

            expect(result.current.isConnected).toBe(false)
            expect(mockPing).toHaveBeenCalledTimes(3)
            assertLastDelay(setTimeoutSpy, FIRST_INTERVAL_MS)
        })
    })
})

describe('lastConnected status', () => {
    test('it sets lastConnected in localStorage when it becomes disconnected', async () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        expect(result.current.isConnected).toBe(true)

        // Mock a network error for the next ping
        mockPing.mockImplementationOnce(failedPing)

        // Trigger a ping (to fail and switch to disconnected)
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(mockPing).toHaveBeenCalledTimes(1)

        // Expect 'disconnected' status now
        expect(result.current.isConnected).toBe(false)
        expect(result.current.isDisconnected).toBe(true)

        // Check localStorage for the dummy date
        const localStorageDate = localStorage.getItem(getLastConnectedKey())
        expect(localStorageDate).toBe(testCurrentDate.toUTCString())

        // Check hook return value
        expect(result.current.lastConnected).toBeInstanceOf(Date)
        expect(result.current.lastConnected).toEqual(testCurrentDate)
    })

    test('lastConnected becomes null when it becomes connected again', async () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })
        expect(result.current.isConnected).toBe(true)

        // Mock a network error for the next ping
        mockPing.mockImplementationOnce(failedPing)

        // Trigger an immediate ping (to fail and switch to disconnected)
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(mockPing).toHaveBeenCalledTimes(1)

        // Verify hook return value
        expect(result.current.isConnected).toBe(false)
        expect(result.current.lastConnected).toEqual(testCurrentDate)

        // Trigger a successful ping to go back online
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(mockPing).toHaveBeenCalledTimes(2)
        expect(result.current.isConnected).toBe(true)
        expect(result.current.lastConnected).toBe(null)
    })

    test('lastConnected persists in localStorage if unmounted while disconnected', async () => {
        const { result, unmount } = renderHook(
            () => useDhis2ConnectionStatus(),
            { wrapper: wrapper }
        )

        // Mock a network error for the next ping to trigger 'disconnected'
        mockPing.mockImplementationOnce(failedPing)
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(result.current.isConnected).toBe(false)

        // Unmount
        unmount()

        // Expect value to persist in localStorage
        const localStorageDate = localStorage.getItem(getLastConnectedKey())
        expect(localStorageDate).toBe(testCurrentDate.toUTCString())
    })

    test('lastConnected is cleared from localStorage after unmounting while connected', async () => {
        const { result, unmount } = renderHook(
            () => useDhis2ConnectionStatus(),
            { wrapper }
        )

        expect(result.current.isConnected).toBe(true)

        // Mock a network error for the next ping to trigger disconnected
        mockPing.mockImplementationOnce(failedPing)
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(result.current.isConnected).toBe(false)

        // Check localStorage for the dummy date
        const localStorageDate = localStorage.getItem(getLastConnectedKey())
        expect(localStorageDate).toBe(testCurrentDate.toUTCString())

        // Trigger another ping to go back to connected
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(result.current.isConnected).toBe(true)

        // Unmount and expect localStorage to be clear for next session
        unmount()
        expect(localStorage.getItem(getLastConnectedKey())).toBe(null)
    })

    describe('starting while disconnected', () => {
        test('it sets lastConnected to `now` if nothing is found in localStorage', async () => {
            // use a custom offlineInterface with `latestIsConnected: false`
            // to initialize the `isConnected` state to false
            const customMockOfflineInterface = {
                ...mockOfflineInterface,
                latestIsConnected: false,
            }
            const customWrapper: React.FC = ({ children }) => (
                <CustomDataProvider data={{}}>
                    <OfflineProvider
                        offlineInterface={customMockOfflineInterface}
                    >
                        {children}
                    </OfflineProvider>
                </CustomDataProvider>
            )

            // render hook with custom wrapper
            renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: customWrapper,
            })

            // expect correct lastConnected time (mocked Date.now())
            expect(localStorage.getItem(getLastConnectedKey())).toBe(
                testCurrentDate.toUTCString()
            )
        })

        test('if a value is already in localStorage, it uses that without overwriting', async () => {
            // seed localStorage with an imaginary 'lastConnected' value from last session
            const testPreviousDate = new Date('2023-01-01')
            localStorage.setItem(
                getLastConnectedKey(),
                testPreviousDate.toUTCString()
            )

            // render hook with custom wrapper
            const customMockOfflineInterface = {
                ...mockOfflineInterface,
                latestIsConnected: false,
            }
            const customWrapper: React.FC = ({ children }) => (
                <CustomDataProvider data={{}}>
                    <OfflineProvider
                        offlineInterface={customMockOfflineInterface}
                    >
                        {children}
                    </OfflineProvider>
                </CustomDataProvider>
            )
            const { result } = renderHook(() => useDhis2ConnectionStatus(), {
                wrapper: customWrapper,
            })

            // On render, the hook should retain last connected
            expect(result.current.lastConnected).not.toBe(null)
            expect(result.current.lastConnected).toEqual(testPreviousDate)
            // should be the same in localStorage too
            expect(localStorage.getItem(getLastConnectedKey())).toBe(
                testPreviousDate.toUTCString()
            )
        })
    })

    test("it doesn't change lastConnected if already disconnected", async () => {
        // seed localStorage with an imaginary 'lastConnected' value from last session
        const testPreviousDate = new Date('2023-01-01')
        localStorage.setItem(
            getLastConnectedKey(),
            testPreviousDate.toUTCString()
        )

        // render hook with custom wrapper
        const customMockOfflineInterface = {
            ...mockOfflineInterface,
            latestIsConnected: false,
        }
        const customWrapper: React.FC = ({ children }) => (
            <CustomDataProvider data={{}}>
                <OfflineProvider offlineInterface={customMockOfflineInterface}>
                    {children}
                </OfflineProvider>
            </CustomDataProvider>
        )
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: customWrapper,
        })

        // As in previous test, the hook should retain last connected
        expect(result.current.lastConnected).toEqual(testPreviousDate)

        // Mock a network error for the next ping and trigger
        mockPing.mockImplementationOnce(failedPing)
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(mockPing).toHaveBeenCalledTimes(1)

        // Expect the same lastConnected as before
        expect(result.current.lastConnected).toEqual(testPreviousDate)
        // should be the same in localStorage too
        expect(localStorage.getItem(getLastConnectedKey())).toBe(
            testPreviousDate.toUTCString()
        )

        // Verify the same with a signal from the service worker
        // get onUpdate function passed to mockOfflineInterface
        const { onUpdate } =
            mockOfflineInterface.subscribeToDhis2ConnectionStatus.mock
                .calls[0][0]
        await act(async () => {
            onUpdate({ isConnected: false })
        })

        // Expect the same lastConnected as before
        expect(result.current.lastConnected).toEqual(testPreviousDate)
    })

    test('lastConnected is saved specifically to an app if a name is provided', async () => {
        // seed localStorage with an imaginary 'lastConnected' value from last session
        const testAppName = 'test-app-name'
        const lastConnectedKey = getLastConnectedKey(testAppName)
        const testPreviousDate = new Date('2023-01-01')
        localStorage.setItem(lastConnectedKey, testPreviousDate.toUTCString())

        // render hook with custom wrapper to start disconnected with app name
        const customMockOfflineInterface = {
            ...mockOfflineInterface,
            latestIsConnected: false,
        }
        const customWrapper: React.FC = ({ children }) => (
            <CustomDataProvider data={{}}>
                <ConfigProvider
                    config={{
                        baseUrl: '..',
                        apiVersion: 42,
                        appName: testAppName,
                    }}
                >
                    <OfflineProvider
                        offlineInterface={customMockOfflineInterface}
                    >
                        {children}
                    </OfflineProvider>
                </ConfigProvider>
            </CustomDataProvider>
        )
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: customWrapper,
        })

        // Expect previous value to be read correctly
        expect(result.current.lastConnected).toEqual(testPreviousDate)

        // Go to connected then disconnected again to generate a new date
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(result.current.isConnected).toBe(true)
        expect(result.current.lastConnected).toBe(null)
        expect(localStorage.getItem(lastConnectedKey)).toBe(null)

        mockPing.mockImplementationOnce(failedPing)
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        expect(result.current.isConnected).toBe(false)
        // Note the new date:
        expect(result.current.lastConnected).toEqual(testCurrentDate)

        // Verify localStorage
        expect(localStorage.getItem(lastConnectedKey)).toBe(
            testCurrentDate.toUTCString()
        )
    })
})
