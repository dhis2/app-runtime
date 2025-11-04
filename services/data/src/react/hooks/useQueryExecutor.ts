import { FetchError } from '@dhis2/data-engine'
import type { QueryExecuteOptions } from '@dhis2/data-engine'
import { useState, useCallback, useRef, useEffect } from 'react'
import { ExecuteHookInput, ExecuteHookResult } from '../../types'
import { useStaticInput } from './useStaticInput'

interface StateType<T> {
    called: boolean
    loading: boolean
    error?: FetchError
    data?: T
}

export const useQueryExecutor = <ReturnType>({
    execute,
    variables: initialVariables,
    singular,
    immediate,
    onComplete,
    onError,
}: ExecuteHookInput<ReturnType>): ExecuteHookResult<ReturnType> => {
    const [theExecute] = useStaticInput(execute)
    const [state, setState] = useState<StateType<ReturnType>>({
        called: !!immediate,
        loading: !!immediate,
    })

    const variables = useRef(initialVariables)

    const abortControllersRef = useRef<AbortController[]>([])
    const abort = useCallback(() => {
        abortControllersRef.current.forEach((controller) => controller.abort())
        abortControllersRef.current = []
    }, [])

    const manualAbort = useCallback(() => {
        abort()
        setState((state) => ({
            called: state.called,
            loading: false,
            error: new FetchError({ type: 'aborted', message: 'Aborted' }),
        }))
    }, [abort])

    const refetch = useCallback(
        (newVariables = {}) => {
            setState((state) =>
                !state.called || !state.loading
                    ? { called: true, loading: true }
                    : state
            )

            if (singular) {
                abort() // Cleanup any in-progress fetches
            }
            const controller = new AbortController()
            abortControllersRef.current.push(controller)

            variables.current = {
                ...variables.current,
                ...newVariables,
            }

            const options: QueryExecuteOptions = {
                variables: variables.current,
                signal: controller.signal,
                onComplete,
                onError,
            }

            return theExecute(options)
                .then((data: ReturnType) => {
                    if (!controller.signal.aborted) {
                        setState({ called: true, loading: false, data })
                        return data
                    }
                    return new Promise<ReturnType>(() => undefined) // Wait forever
                })
                .catch((error: FetchError) => {
                    if (!controller.signal.aborted) {
                        setState({ called: true, loading: false, error })
                    }
                    return new Promise<ReturnType>(() => undefined) // Don't throw errors in refetch promises, wait forever
                })
        },
        [abort, onComplete, onError, singular, theExecute]
    )

    // Don't include immediate or refetch as deps, otherwise unintentional refetches
    // may be triggered by changes to input, i.e. recreating the onComplete callback
    useEffect(() => {
        if (immediate) {
            refetch()
        }
        return abort
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return { refetch, abort: manualAbort, ...state }
}
