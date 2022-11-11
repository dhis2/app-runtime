import { useRef, useCallback, useEffect, useState } from 'react'

const ONE_SECOND = 1000
const FIVE_MINUTES = 1000 * 60 * 5
const DEFAULT_INCREMENT_FACTOR = 1.2
const throwErrorIfNoCallbackIsProvided = () => {
    throw new Error('Provide a callback')
}

// todo: types

/**
 * Functions returned:
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
    initialDelay = ONE_SECOND,
    maxDelay = FIVE_MINUTES,
    delayIncrementFactor = DEFAULT_INCREMENT_FACTOR,
    initialPauseValue = false,
    callback = throwErrorIfNoCallbackIsProvided,
} = {}): any {
    const timeoutRef = useRef(null as any)
    const [delay, setDelay] = useState(initialDelay)
    const [paused, setPaused] = useState(initialPauseValue)
    const [standby, setStandby] = useState(false)

    const incrementDelay = useCallback(() => {
        setDelay((currDelay) =>
            // Increment delay up to the max value
            Math.min(currDelay * delayIncrementFactor, maxDelay)
        )
    }, [maxDelay, delayIncrementFactor])

    /**
     * If callback returns a truthy value, increment delay.
     * Otherwise, reset it to its initial value
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

    const clearTimeoutAndStart = useCallback(() => {
        // Prevent parallel timeouts from occuring
        clearTimeout(timeoutRef.current)

        // A timeout is used instead of an interval for handling slow execution
        // https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency
        timeoutRef.current = setTimeout(() => {
            // Schedule callback to be executed after current delay
            if (paused) {
                // Set this hook into a 'standby' state, ready to execute when
                // 'resume' is called (See `resume()` below)
                setStandby(true)
            } else {
                // Invoke callback
                invokeCallbackAndHandleDelay()
                // Start process over again
                clearTimeoutAndStart()
            }
        }, delay)
    }, [delay, invokeCallbackAndHandleDelay, paused])

    useEffect(() => {
        // Start timer on mount
        clearTimeoutAndStart()

        return () => {
            // Clear timeout when component unmounts
            clearTimeout(timeoutRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const pause = useCallback(() => setPaused(true), [])
    const resume = useCallback(() => {
        setPaused(false)
        if (standby) {
            // (Same execution as in clearTimeoutAndStart)
            invokeCallbackAndHandleDelay()
            clearTimeoutAndStart()
        }
    }, [standby, invokeCallbackAndHandleDelay, clearTimeoutAndStart])
    const resetBackoff = useCallback(
        () => setDelay(initialDelay),
        [initialDelay]
    )
    const snooze = clearTimeoutAndStart

    return {
        pause,
        resume,
        snooze,
        resetBackoff,
    }
}
