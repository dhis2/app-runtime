import { useRef, useCallback, useEffect, useState } from 'react'

const FIVE_SECONDS = 5000
const FIVE_MINUTES = 1000 * 60 * 5
const DEFAULT_INCREMENT_FACTOR = 1.2
const throwErrorIfNoCallbackIsProvided = () => {
    throw new Error('Provide a callback')
}

// todo: types

/**
 * This hook calls a provided callback at increasing intervals up to a maximum interval.
 * The initialDelay, maxDelay, and delayIncrementFactor options passed to the hook
 * can configure the interval behavior.
 *
 * The provided callback can return (todo: or resolve to) a boolean value. If the value is
 * truthy, the delay will be increased by the delayIncrementFactor; If the value is falsy,
 * the delay will be reset to the initialDelay. Then a timeout will be set to invoke the
 * callback again after the new delay.
 *
 * It returns these functions to interact with the timing:
 *
 * invokeCallbackImmediately(): invokes the provided callback immediately and starts the timer over.
 * The timeout to the next callback invocation will not be increased.
 *
 * pause(): don't change the timer; set a flag. If still 'paused' when timer function is up,
 * set 'standby' flag and stop timer instead of executing callback (and restarting timer) normally.
 * See 'resume()'
 *
 * resume(): removes 'paused' flag. If 'standby' flag is set, triggers callback and starts timer
 *
 * snooze(): restart timer that would trigger callback, using the current `delay` duration
 * (expected to be called to delay a ping in response to incidental network traffic)
 *
 * resetBackoff(): set delay back to initial (expected to be used if online value changes)
 * -- this could maybe draw on a return value from callback to decide to increment or not
 */
export default function useSmartIntervals({
    initialDelay = FIVE_SECONDS,
    maxDelay = FIVE_MINUTES,
    delayIncrementFactor = DEFAULT_INCREMENT_FACTOR,
    initialPauseValue = false,
    callback = throwErrorIfNoCallbackIsProvided,
} = {}): any {
    const timeoutRef = useRef(null as any)

    // todo: use refs for this
    const [delay, setDelay] = useState(initialDelay)

    const standbyCallbackRef = useRef(null as null | (() => void))
    const clearTimeoutAndStartFnRef = useRef((): void => undefined)
    const pausedRef = useRef(initialPauseValue)

    const incrementDelay = useCallback(() => {
        setDelay((currDelay) => {
            // Increment delay up to the max value
            const newDelay = Math.min(
                currDelay * delayIncrementFactor,
                maxDelay
            )
            console.log('incrementing delay', { currDelay, newDelay })
            return newDelay
        })
    }, [maxDelay, delayIncrementFactor])

    /**
     * If callback returns a truthy value, increment delay.
     * Otherwise, reset it to its initial value
     * TODO: Maybe don't need these; 'handleChange' can use `snooze()`.
     *
     * TODO: Handle async callbacks
     */
    const invokeCallbackAndHandleDelay = useCallback(() => {
        const result = callback()
        if (result) {
            incrementDelay()
            return
        } else {
            // Reset delay
            setDelay(initialDelay)
        }
    }, [callback, incrementDelay, initialDelay])

    clearTimeoutAndStartFnRef.current = useCallback(() => {
        console.log('clear and start', { delay /* standby */ })

        // Prevent parallel timeouts from occuring
        clearTimeout(timeoutRef.current)

        // A timeout is used instead of an interval for handling slow execution
        // https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency
        timeoutRef.current = setTimeout(() => {
            // If paused, prepare a 'standby callback' to be invoked when
            // `resume()` is called (see its definition below).
            // The timer will not be started again until the standbyCallback
            // is invoked.
            if (pausedRef.current) {
                console.log('entering regular standby')

                standbyCallbackRef.current = () => {
                    invokeCallbackAndHandleDelay()
                    clearTimeoutAndStartFnRef.current()
                }

                return
            }

            // Otherwise, invoke callback
            invokeCallbackAndHandleDelay()
            // and start process over again
            clearTimeoutAndStartFnRef.current()
        }, delay)
    }, [delay, invokeCallbackAndHandleDelay])

    useEffect(() => {
        // Start timer on mount
        clearTimeoutAndStartFnRef.current()

        return () => {
            // Clear timeout when component unmounts
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const invokeCallbackImmediately = useCallback(() => {
        if (pausedRef.current) {
            if (standbyCallbackRef.current === null) {
                // If there is not existing standbyCallback,
                // set standby function to be called upon `resume()`
                // (don't overwrite a previous callback).
                // See setTimeout call above too.
                // The timed out function set in `clearTimeoutAndStart` may
                // overwrite this callback if the timer elapses, so that the
                // timeout delay gets incremented appropriately.
                console.log('entering standby without timer increment')

                standbyCallbackRef.current = () => {
                    // Invoke callback and start timer without incrementing
                    callback()
                    clearTimeoutAndStartFnRef.current()
                }
            }

            // Skip rest of execution while paused
            return
        }

        // Invoke callback and start timer without incrementing
        callback()
        clearTimeoutAndStartFnRef.current()
    }, [callback])

    const pause = useCallback(() => {
        console.log('pause')

        pausedRef.current = true
    }, [])

    const resume = useCallback(() => {
        console.log('resume', { standbyCb: standbyCallbackRef.current })

        // Clear paused state
        pausedRef.current = false

        // If in standby, invoke the saved callback
        // (invokeCallbackImmediately and clearTimeoutAndStart can set a
        // standby callback)
        if (standbyCallbackRef.current !== null) {
            standbyCallbackRef.current()
            // Remove existing standbyCallback
            standbyCallbackRef.current = null
        }
    }, [])

    const resetBackoff = useCallback(() => {
        console.log('reset backoff')

        setDelay(initialDelay)
    }, [initialDelay])

    const snooze = () => clearTimeoutAndStartFnRef.current()

    return {
        invokeCallbackImmediately,
        pause,
        resume,
        resetBackoff,
        snooze,
    }
}
