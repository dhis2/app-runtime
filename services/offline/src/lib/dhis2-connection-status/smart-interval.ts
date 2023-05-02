import { devDebugLog } from './dev-debug-log'

// Exported for tests
export const DEFAULT_INITIAL_DELAY_MS = 1000 * 30 // 30 sec
export const DEFAULT_MAX_DELAY_MS = 1000 * 60 * 5 // 5 min
export const DEFAULT_INCREMENT_FACTOR = 1.5
const throwErrorIfNoCallbackIsProvided = (): void => {
    throw new Error('Provide a callback')
}

export interface SmartInterval {
    clear: () => void
    pause: () => void
    resume: () => void
    invokeCallbackImmediately: () => void
    snooze: () => void
    reset: () => void
}

export default function createSmartInterval({
    initialDelay = DEFAULT_INITIAL_DELAY_MS,
    maxDelay = DEFAULT_MAX_DELAY_MS,
    delayIncrementFactor = DEFAULT_INCREMENT_FACTOR,
    initialPauseValue = false,
    callback = throwErrorIfNoCallbackIsProvided,
} = {}): SmartInterval {
    const state = {
        paused: initialPauseValue,
        delay: initialDelay,
        // Timeout types are weird; this dummy timeout helps fix them:
        // (named to help debugging in tests)
        timeout: setTimeout(function dummyTimeout() {
            return
        }, 0),
        standbyCallback: null as null | (() => void),
    }

    /** Increment delay by the increment factor, up to a max value */
    function incrementDelay() {
        const newDelay = Math.min(state.delay * delayIncrementFactor, maxDelay)
        devDebugLog('[SI] incrementing delay', {
            prev: state.delay,
            new: newDelay,
        })
        state.delay = newDelay
    }

    function invokeCallbackAndHandleDelay(): void {
        // Increment delay before calling callback, so callback can potentially
        // reset the delay to initial before starting the next timeout
        incrementDelay()
        callback()
    }

    function clearTimeoutAndStart(): void {
        devDebugLog('[SI] clearing and starting timeout', {
            delay: state.delay,
        })

        // Prevent parallel timeouts from occuring
        // (weird note: `if (this.timeout) { clearTimeout(this.timeout) }`
        // does NOT work for some reason)
        clearTimeout(state.timeout)

        // A timeout is used instead of an interval for handling slow execution
        // https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency
        state.timeout = setTimeout(function callbackAndRestart() {
            if (state.paused) {
                devDebugLog('[SI] entering regular standby')

                // If paused, prepare a 'standby callback' to be invoked when
                // `resume()` is called (see its definition below).
                // The timer will not be started again until the standbyCallback
                // is invoked.
                state.standbyCallback = () => {
                    invokeCallbackAndHandleDelay()
                    clearTimeoutAndStart()
                }

                return
            }

            // Otherwise, invoke callback
            invokeCallbackAndHandleDelay()
            // and start process over again
            clearTimeoutAndStart()
        }, state.delay)
    }

    /** Stop the interval. Used for cleaning up */
    function clear(): void {
        clearTimeout(state.timeout)
    }

    /**
     * Invoke the provided callback immediately and start the timer over.
     * The timeout to the next invocation will not be increased
     * (unless the timer fully elapses while this interval is paused).
     *
     * If the interval is 'paused', it will not invoke the callback immediately,
     * but enter a 'partial standby', which will invoke the callback upon
     * resuming, but without incrementing the delay. If the regular timeout
     * elapses while paused, the regular standby is entered, overwriting this
     * partial standby.
     */
    function invokeCallbackImmediately(): void {
        if (state.paused) {
            if (state.standbyCallback === null) {
                // If there is not an existing standbyCallback,
                // set one to be called upon `resume()`
                // (but don't overwrite a previous callback).
                // See setTimeout call above too.
                // The timed out function set in `clearTimeoutAndStart` may
                // overwrite this callback if the timer elapses, so that the
                // timeout delay gets incremented appropriately.
                devDebugLog('[SI] entering standby without timer increment')

                state.standbyCallback = () => {
                    // Invoke callback and start timer without incrementing
                    callback()
                    clearTimeoutAndStart()
                }
            }

            // Skip rest of execution while paused
            return
        }

        // Invoke callback and start timer without incrementing
        callback()
        clearTimeoutAndStart()
    }

    /**
     * Sets a 'paused' flag (doesn't yet stop the timer):
     *
     * If the main timer elapses or `invokeCallbackImmediately` is called
     * while the interval is paused, the timer will not be started again.
     * Instead, a callback function will be saved that will be called when
     * `resume()` is called (see its definition below)
     *
     * This decreases execution activity while 'paused'
     */
    function pause(): void {
        devDebugLog('[SI] pausing')

        state.paused = true
    }

    /**
     * Removes 'paused' state
     *
     * If the interval is in 'standby', trigger the saved 'standbyCallback',
     * which should start the interval timer again
     */
    function resume(): void {
        devDebugLog('[SI] resuming', { standbyCb: state.standbyCallback })

        // Clear paused state
        state.paused = false

        // If in standby, invoke the saved callback
        // (invokeCallbackImmediately and clearTimeoutAndStart can set a
        // standby callback)
        if (state.standbyCallback !== null) {
            state.standbyCallback()
            // Remove existing standbyCallback
            state.standbyCallback = null
        }
    }

    /**
     * Restart the timer to the next callback invocation, using the current
     * delay
     *
     * Expected to be called to delay a ping in response to incidental network
     * traffic, for example
     */
    function snooze(): void {
        devDebugLog('[SI] snoozing timeout')

        clearTimeoutAndStart()
    }

    /**
     * Cancels the current timeout and starts a new one with the initial delay
     */
    function reset(): void {
        devDebugLog('[SI] resetting interval from beginning')

        state.delay = initialDelay
        clearTimeoutAndStart()
    }

    // Start the timer!
    clearTimeoutAndStart()

    return {
        clear,
        pause,
        resume,
        invokeCallbackImmediately,
        snooze,
        reset,
    }
}
