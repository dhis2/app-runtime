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

const wrapper: React.FC = ({ children }) => (
    <CustomDataProvider data={{}}>
        <OfflineProvider offlineInterface={mockOfflineInterface}>
            {children}
        </OfflineProvider>
    </CustomDataProvider>
)

const setTimeoutSpy = jest.spyOn(window, 'setTimeout')

beforeEach(() => {
    jest.useFakeTimers()
    // standby state is initialized to window visibility, which is 'false' by
    // default in tests. mock that here:
    jest.spyOn(document, 'hasFocus').mockReturnValueOnce(true)
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

    test.skip('the ping delay increases when idle', () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout')

        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        expect(mockPing).not.toHaveBeenCalled()
        expect(setTimeoutSpy).toHaveBeenCalledTimes(2)

        expect(result.current.isConnected).toBe(true)

        jest.advanceTimersByTime(FIRST_INTERVAL_MS - 500) // Just under first interval
        expect(mockPing).not.toHaveBeenCalled()

        setTimeoutSpy.mockClear()

        jest.advanceTimersByTime(1000) // Just over first interval
        expect(mockPing).toHaveBeenCalledTimes(1)
        expect(setTimeoutSpy).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(SECOND_INTERVAL_MS - 1000) // just under second interval
        expect(mockPing).toHaveBeenCalledTimes(1)

        jest.runAllTimers()
        // jest.advanceTimersByTime(1000) // Just over second interval
        expect(mockPing).toHaveBeenCalledTimes(2)

        jest.advanceTimersByTime(THIRD_INTERVAL_MS - 1000) // just under third interval
        expect(mockPing).toHaveBeenCalledTimes(2)

        jest.advanceTimersByTime(1000) // Just over third interval
        expect(mockPing).toHaveBeenCalledTimes(3)

        // ...etc
    })

    test.skip('the delay stops incrementing once it reaches a max', () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        // The length of the Nth interval is:
        // initialDelay * incrementFactor ^ (N - 1)
        // Using some algebra and the law of logs, the Nth interval
        // which is longer than the max delay is:
        // N >= (ln (maxDelay / initialDelay) / ln (incrementFactor)) + 1
        //  - then use Math.ceil to handle the 'greater than' effect
        // ~ ~ ~
        // Math! ⚛️ 🤓
        const intervalsToReachMaxDelay = Math.ceil(
            Math.log(DEFAULT_MAX_DELAY_MS / DEFAULT_INITIAL_DELAY_MS) /
                Math.log(DEFAULT_INCREMENT_FACTOR) +
                1
        )

        // Elapse enough intervals to get to the max delay (+1 just to be sure)
        for (let i = 0; i <= intervalsToReachMaxDelay; i++) {
            jest.runAllTimers()
        }

        // reset ping mock? or, make a note of how many times mock has been called now
        expect(mockPing).toHaveBeenCalledTimes(5)

        jest.advanceTimersByTime(DEFAULT_MAX_DELAY_MS - 500)
        // expect mock to not have been called (or num times hasn't changed)
        jest.advanceTimersByTime(1000)
        // expect mock to be called one more time

        // Two more times, check if the ping delay is the max each time
        for (let i = 1; i < 3; i++) {
            // Note time is different than above
            jest.advanceTimersByTime(DEFAULT_MAX_DELAY_MS - 1000)
            // expect mock to have been called `i` times (or num times hasn't changed)
            jest.advanceTimersByTime(1000)
            // expect mock to be called one more time (i+1)
        }
    })
})

describe('pings are delayed when offlineInterface sends status updates', () => {
    test.skip('if the status is the same', () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        // get onUpdate function passed to mockOfflineInterface
        const { onUpdate } =
            mockOfflineInterface.subscribeToDhis2ConnectionStatus.mock.calls[0]

        // invoke it at a few intervals, before pings are scheduled
        for (let i = 0; i < 3; i++) {
            jest.advanceTimersByTime(DEFAULT_INITIAL_DELAY_MS - 2000)
            onUpdate({ isConnected: true })
        }

        // expect ping mock not to have been called
    })

    test.skip('the delay stays the same', () => {
        const { result } = renderHook(() => useDhis2ConnectionStatus(), {
            wrapper: wrapper,
        })

        // get onUpdate function passed to mockOfflineInterface
        const { onUpdate } =
            mockOfflineInterface.subscribeToDhis2ConnectionStatus.mock.calls[0]

        // let two intervals pass to allow delay to increase
        jest.runAllTimers()
        jest.runAllTimers()

        // ...delay should now be 'THIRD_INTERVAL_MS'
        // todo: assert on setTimeout mock

        // simulate updates from the SW/offline interface several times
        // invoke it at a few intervals, before pings are scheduled
        for (let i = 0; i < 3; i++) {
            jest.advanceTimersByTime(THIRD_INTERVAL_MS - 2000)
            onUpdate({ isConnected: true })
        }

        // ping mock should only have been called twice
        // expect(pingMock).toHaveBeenCalledTimes(2)

        // the delay should still be THIRD_INTERVAL_MS
        // todo: assert on setTimeout mock

        jest.advanceTimersByTime(THIRD_INTERVAL_MS - 500)
        // expect(pingMock).toHaveBeenCalledTimes(2)
        jest.advanceTimersByTime(1000)
        // expect(pingMock).toHaveBeenCalledTimes(3)
    })
})

describe('the ping interval resets to initial if the detected connection status changes', () => {
    test.todo('this happens when the offline interface issues an update')
    test.todo('this happens if a ping detects a status change')
})

describe('pings aren\'t sent when the app is not focused; "standby behavior"', () => {
    test.todo("it doesn't ping when the app loses focus and is never refocused")
    test.todo("it doesn't ping if the app is never focused (even upon startup)")
    test.todo(
        'if the app is defocused and refocused between two pings, pings happen normally'
    )
    test.todo(
        'if the app is defocused until after a scheduled ping, that ping is not sent until the app is refocused'
    )
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
