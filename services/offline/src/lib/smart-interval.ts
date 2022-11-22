const FIVE_SECONDS = 5000
const FIVE_MINUTES = 1000 * 60 * 5
const DEFAULT_INCREMENT_FACTOR = 1.2
const throwErrorIfNoCallbackIsProvided = () => {
    throw new Error('Provide a callback')
}

class SmartInterval {
    initialDelay
    maxDelay
    delayIncrementFactor
    callback: () => void | Promise<void>

    paused
    delay
    // Timeout types are weird and initializing this to a dummy timeout
    // clears up some checks
    timeout: NodeJS.Timeout = setTimeout(() => '', 0)
    standbyCallback: (() => void) | null = null

    constructor({
        initialDelay = FIVE_SECONDS,
        maxDelay = FIVE_MINUTES,
        delayIncrementFactor = DEFAULT_INCREMENT_FACTOR,
        initialPauseValue = false,
        callback = throwErrorIfNoCallbackIsProvided,
    } = {}) {
        // initialize static parameters
        this.initialDelay = initialDelay
        this.maxDelay = maxDelay
        this.delayIncrementFactor = delayIncrementFactor
        this.callback = callback

        // initialize dynamic parameters
        this.paused = initialPauseValue
        this.delay = initialDelay

        this.clearTimeoutAndStart()
    }

    /** Increment delay by the increment factor, up to a max value */
    private incrementDelay() {
        const newDelay = Math.min(
            this.delay * this.delayIncrementFactor,
            this.maxDelay
        )
        console.log('incrementing delay', { prev: this.delay, new: newDelay })
        this.delay = newDelay
    }

    /**
     * Optional extension to this:
     * If callback returns (or resolves to) a truthy value, increment delay.
     * Otherwise, reset it to its initial value.
     * (maybe don't need this; a consumer can call 'snooze')
     */
    private invokeCallbackAndHandleDelay(): void {
        this.callback()
        this.incrementDelay()
    }

    private clearTimeoutAndStart(): void {
        console.log('clearing and starting timeout', { delay: this.delay })

        // Prevent parallel timeouts from occuring
        // (weird note: `if (this.timeout) { clearTimeout(this.timeout) }`
        // does NOT work for some reason)
        clearTimeout(this.timeout)

        // A timeout is used instead of an interval for handling slow execution
        // https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency
        this.timeout = setTimeout(async () => {
            if (this.paused) {
                console.log('entering regular standby')

                // If paused, prepare a 'standby callback' to be invoked when
                // `resume()` is called (see its definition below).
                // The timer will not be started again until the standbyCallback
                // is invoked.
                this.standbyCallback = (() => {
                    this.invokeCallbackAndHandleDelay()
                    this.clearTimeoutAndStart()
                }).bind(this)

                return
            }

            // Otherwise, invoke callback
            this.invokeCallbackAndHandleDelay()
            // and start process over again
            this.clearTimeoutAndStart()
        }, this.delay)
    }

    /** Stop the interval. Used for cleaning up */
    clear(): void {
        clearTimeout(this.timeout)
    }

    /**
     * Invoke the provided callback immediately and start the timer over.
     * The timeout to the next invocation will not be increased
     * (unless the timer fully elapses while this interval is paused)
     */
    invokeCallbackImmediately(): void {
        if (this.paused) {
            if (this.standbyCallback === null) {
                // If there is not an existing standbyCallback,
                // set one to be called upon `resume()`
                // (but don't overwrite a previous callback).
                // See setTimeout call above too.
                // The timed out function set in `clearTimeoutAndStart` may
                // overwrite this callback if the timer elapses, so that the
                // timeout delay gets incremented appropriately.
                console.log('entering standby without timer increment')

                this.standbyCallback = () => {
                    // Invoke callback and start timer without incrementing
                    this.callback()
                    this.clearTimeoutAndStart()
                }
            }

            // Skip rest of execution while paused
            return
        }

        // Invoke callback and start timer without incrementing
        this.callback()
        this.clearTimeoutAndStart()
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
    pause(): void {
        console.log('pausing')

        this.paused = true
    }

    /**
     * Removes 'paused' state
     *
     * If the interval is in 'standby', trigger the saved 'standbyCallback',
     * which should start the interval timer again
     */
    resume(): void {
        console.log('resuming', { standbyCb: this.standbyCallback })

        // Clear paused state
        this.paused = false

        // If in standby, invoke the saved callback
        // (invokeCallbackImmediately and clearTimeoutAndStart can set a
        // standby callback)
        if (this.standbyCallback !== null) {
            this.standbyCallback()
            // Remove existing standbyCallback
            this.standbyCallback = null
        }
    }

    /**
     * Restart the timer to the next callback invocation, using the current
     * delay
     *
     * Expected to be called to delay a ping in response to incidental network
     * traffic, for example
     */
    snooze(): void {
        console.log('snoozing')

        this.clearTimeoutAndStart()
    }

    resetBackoff(): void {
        console.log('resetting backoff to initialDelay')

        this.delay = this.initialDelay
    }
}

export default SmartInterval
