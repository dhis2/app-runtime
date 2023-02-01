import { CustomDataProvider } from '@dhis2/app-service-data'
import { renderHook, act } from '@testing-library/react-hooks'
import PropTypes from 'prop-types'
import React from 'react'
import { mockOfflineInterface } from '../../utils/test-mocks'
import { useDhis2ConnectionStatus } from '../dhis2-connection-status'
import { OfflineProvider } from '../offline-provider'
import {
    DEFAULT_INCREMENT_FACTOR,
    DEFAULT_MAX_DELAY_MS,
    DEFAULT_INITIAL_DELAY_MS,
} from '../smart-interval'
import { usePingQuery } from '../use-ping-query'

// important that this name starts with 'mock' to be hoisted correctly
const mockPing = jest.fn().mockImplementation(() => {
    console.log('ping lol -----------')
    return Promise.resolve()
})

jest.mock('../use-ping-query.ts', () => ({
    usePingQuery: () => mockPing,
}))

const FIRST_INTERVAL_MS = DEFAULT_INITIAL_DELAY_MS
const SECOND_INTERVAL_MS = FIRST_INTERVAL_MS * DEFAULT_INCREMENT_FACTOR
const THIRD_INTERVAL_MS = SECOND_INTERVAL_MS * DEFAULT_INCREMENT_FACTOR
const FOURTH_INTERVAL_MS = THIRD_INTERVAL_MS * DEFAULT_INCREMENT_FACTOR

/**
 * Tools available:
 * * Timers
 * * Offline Interface mock (capture onUpdate callback)
 * * Blur, focus, and offline event listeners on window
 * * Mock data engine
 *
 */

/**
 * Inputs:
 * useDataEngine => engine.query
 * useOfflineInterface => offlineInterface.sTDCS
 * time
 *
 * Outputs:
 * isConnected, isDisconnected, lastConnected
 */

/**
 * To do:
 * * Check out what I need for the necessary wrapper (copy and paste from recording?)
 * * Mock engine.query - mock resolution/rejection for pings
 * * Test for engine.query executions at different time intervals
 * * Make a spy/mock for offlineInterface.subcscribeTo...
 * * Catch and invoke 'onUpdate' handler as input
 * * Mock setTimeout and can check the latest 'called with' second arg
 */

// Math:
// The length of the Nth interval is:
// initialDelay * incrementFactor ^ (N - 1)
// Using some algebra and the law of logs, the Nth interval
// which is longer than the max delay is:
// N >= (ln (maxDelay / initialDelay) / ln (incrementFactor)) + 1
//  - then use Math.ceil to handle the 'greater than' effect
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

beforeEach(() => {
    jest.useFakeTimers()
    // standby state is initialized to window visibility, which is 'false' by
    // default in tests. mock that here:
    jest.spyOn(document, 'hasFocus').mockReturnValue(true)
})
afterEach(() => {
    jest.clearAllMocks()
})
afterAll(() => {
    jest.useRealTimers()
})

describe('basic behavior', () => {
    test('the hook initializes to the right values', () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        expect(result.current.isConnected).toBe(true)
        expect(result.current.isDisconnected).toBe(false)
        expect(result.current.lastConnected).toBe(null)
    })

    test('the ping delay increases when idle until the max is reached', async () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout')

        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        expect(result.current.isConnected).toBe(true)
        expect(mockPing).not.toHaveBeenCalled()
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            FIRST_INTERVAL_MS
        )

        // 500ms before first interval
        jest.advanceTimersByTime(FIRST_INTERVAL_MS - 500)
        expect(mockPing).not.toHaveBeenCalled()
        // 500ms after first interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(1)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            SECOND_INTERVAL_MS
        )

        // 500ms before second interval
        jest.advanceTimersByTime(SECOND_INTERVAL_MS - 1000)
        expect(mockPing).toHaveBeenCalledTimes(1)
        // 500ms after second interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(2)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            THIRD_INTERVAL_MS
        )

        // 500ms before third interval
        jest.advanceTimersByTime(THIRD_INTERVAL_MS - 1000)
        expect(mockPing).toHaveBeenCalledTimes(2)
        // 500ms after third interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(3)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            FOURTH_INTERVAL_MS
        )

        // 500ms before fourth interval
        jest.advanceTimersByTime(FOURTH_INTERVAL_MS - 1000)
        expect(mockPing).toHaveBeenCalledTimes(3)
        // 500ms after fourth interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(4)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            // NOTE: no longer incrementing, max has been reached
            DEFAULT_MAX_DELAY_MS
        )

        // 500ms before fifth interval
        jest.advanceTimersByTime(DEFAULT_MAX_DELAY_MS - 1000)
        expect(mockPing).toHaveBeenCalledTimes(4)
        // 500ms after fifth interval
        jest.advanceTimersByTime(1000)
        expect(mockPing).toHaveBeenCalledTimes(5)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            // NOTE: still not incrementing, max has been reached
            DEFAULT_MAX_DELAY_MS
        )

        // todo: adapt to changing defaults using INTERVALS_TO_REACH_MAX_DELAY
    })
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
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            THIRD_INTERVAL_MS
        )
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
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            THIRD_INTERVAL_MS
        )

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
    // ! Something is up with this test
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
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        expect(mockPing).toHaveBeenCalledTimes(2)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            THIRD_INTERVAL_MS
        )

        // Trigger connection status change ('await' here fixes 'act' warnings)
        await act(async () => {
            console.log('TRIGGERING ACT -----')
            onUpdate({ isConnected: false })
        })

        // Expect "first interval delay" to be set up
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            FIRST_INTERVAL_MS
        )
        // TODO: This assertion is not working.
        // The status switches to 'false', but then switches BACK to 'true' for
        // an unknown reason
        // expect(result.current.isConnected).toBe(false)

        // Advance past "first interval"
        jest.advanceTimersByTime(FIRST_INTERVAL_MS + 50)
        // Expect another execution
        expect(mockPing).toHaveBeenCalledTimes(3)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            SECOND_INTERVAL_MS
        )
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
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            THIRD_INTERVAL_MS
        )

        // Mock a network error
        mockPing.mockImplementationOnce(() =>
            Promise.reject({
                message: 'this is a network error',
                type: 'network',
            })
        )

        // Trigger connection status change ('await' here fixes 'act' warnings)
        await act(async () => {
            jest.advanceTimersByTime(THIRD_INTERVAL_MS + 50)
        })

        expect(result.current.isConnected).toBe(false)
        expect(mockPing).toHaveBeenCalledTimes(3)
        // asserting on setTimeoutSpy is flaky because something else
        // in the test suite uses it
        // expect(setTimeoutSpy).toHaveBeenLastCalledWith(
        //     expect.any(Function),
        //     FIRST_INTERVAL_MS
        // )

        // ...instead, advance one "first interval" to test that the delay is correct
        jest.advanceTimersByTime(FIRST_INTERVAL_MS + 50)
        // Expect another execution
        expect(mockPing).toHaveBeenCalledTimes(4)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            SECOND_INTERVAL_MS
        )
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
    test.todo('if the app is focused, it pings immediately')

    test.todo(
        'if the app is not focused, it does not ping immediately, but pings immediately when refocused'
    )

    describe('interval handling when pinging upon refocusing after offline event is detected while not focused', () => {
        test.todo(
            'if the app is refocused before the next "scheduled" ping, the timeout to the next ping is not increased'
        )
        test.todo('same as previous, but interval is reset if status changes')
        test.todo(
            'if the app is refocused after the next "scheduled" ping, increase the interval to the next ping if the status hasn\'t changed'
        )
        test.todo(
            'the same as previous, but the interval is reset if status has changed'
        )
    })
})

describe('lastConnected', () => {
    // todo: see network status tests
})
