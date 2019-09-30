import { useState, useCallback, useRef, useEffect } from 'react'

import { FetchError, QueryExecuteOptions } from '../../engine'
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
    const abort = () => {
        abortControllersRef.current.forEach(controller => controller.abort())
        abortControllersRef.current = []
    }

    const refetch = useCallback(
        (newVariables = {}) => {
            setState(state =>
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
                    return new Promise<ReturnType>(() => {})
                })
                .catch((error: FetchError) => {
                    if (!controller.signal.aborted) {
                        setState({ called: true, loading: false, error })
                    }
                    return new Promise<ReturnType>(() => {}) // Don't throw errors in refetch promises, wait forever
                })
        },
        [onComplete, onError, singular, theExecute]
    )

    useEffect(() => {
        if (immediate) {
            refetch()
        }
        return abort
    }, [immediate, refetch])

    return { refetch, abort, ...state }
}
