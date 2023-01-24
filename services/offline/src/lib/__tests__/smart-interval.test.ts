import { rest } from 'lodash'
import createSmartInterval, {
    DEFAULT_INCREMENT_FACTOR,
    DEFAULT_MAX_DELAY_MS,
    DEFAULT_INITIAL_DELAY_MS,
    dumbInterval,
} from '../smart-interval'

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

beforeEach(() => {
    jest.useFakeTimers()
})
afterAll(() => {
    jest.useRealTimers()
})

/** This test verifies repeated intervals _can_ work in jest environments */
test.only('dumb interval', () => {
    const mockCb = jest.fn()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    dumbInterval({ callback: mockCb })

    expect(mockCb).not.toHaveBeenCalled()
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(
        expect.any(Function),
        FIRST_INTERVAL_MS
    )

    jest.advanceTimersToNextTimer()
    expect(mockCb).toHaveBeenCalledTimes(1)
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(
        expect.any(Function),
        SECOND_INTERVAL_MS
    )

    jest.advanceTimersToNextTimer()
    expect(mockCb).toHaveBeenCalledTimes(2)
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(
        expect.any(Function),
        THIRD_INTERVAL_MS
    )

    jest.advanceTimersToNextTimer()
    expect(mockCb).toHaveBeenCalledTimes(3)

    jest.advanceTimersToNextTimer(5)
    expect(mockCb).toHaveBeenCalledTimes(8)
})

describe('(smart interval) basic behavior', () => {
    test('interval length increases with no intervention', () => {
        const mockCb = jest.fn()
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

        const smartInterval = createSmartInterval({ callback: mockCb })
        smartInterval.start()

        expect(mockCb).not.toHaveBeenCalled()
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            FIRST_INTERVAL_MS
        )

        jest.advanceTimersToNextTimer()
        expect(mockCb).toHaveBeenCalledTimes(1)
        expect(setTimeoutSpy).toHaveBeenLastCalledWith(
            expect.any(Function),
            SECOND_INTERVAL_MS
        )
    })
})
