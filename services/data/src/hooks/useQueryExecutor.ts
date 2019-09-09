import { useState, useCallback, useRef, useEffect } from 'react'

import { FetchError } from '../engine/types/FetchError'
import { QueryExecuteOptions } from '../engine/types/ExecuteOptions'
import { ExecuteHookInput, ExecuteHookResult, ExecuteFunction } from '../types'
import { useStaticInput } from './useStaticInput'

const empty = {}
export const useQueryExecutor = <ReturnType>({
    execute,
    variables: initialVariables = empty,
    singular = false,
    immediate = false,
    onCompleted,
    onError,
}: ExecuteHookInput<ReturnType>): ExecuteHookResult<ReturnType> => {
    const [theExecute] = useStaticInput<ExecuteFunction<ReturnType>>(
        execute,
        'execute function'
    )
    const [called, setCalled] = useState(immediate ? true : false)
    const [loading, setLoading] = useState(immediate ? true : false)
    const [error, setError] = useState<FetchError | undefined>(undefined)
    const [data, setData] = useState<any>(undefined)

    const variables = useRef(initialVariables)

    const abortControllersRef = useRef<AbortController[]>([])
    const abort = () => {
        console.error('ABORTED', abortControllersRef.current)
        abortControllersRef.current.forEach(controller => controller.abort())
        abortControllersRef.current = []
    }

    const refetch = useCallback(
        (newVariables = {}) => {
            setCalled(true)
            setLoading(true)

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
                onCompleted,
                onError,
            }

            const promise = theExecute(options)

            return promise
                .then((data: ReturnType) => {
                    console.log('return', data, controller.signal.aborted)
                    if (!controller.signal.aborted) {
                        setLoading(false)
                        setData(data)
                        return data
                    }
                    return new Promise<ReturnType>(() => {})
                })
                .catch((error: FetchError) => {
                    console.log('error', error)
                    if (!controller.signal.aborted) {
                        setLoading(false)
                        setError(error)
                        console.warn('Ignored fetch error', error)
                    }
                    return new Promise<ReturnType>(() => {})
                })
        },
        [onCompleted, onError, singular, theExecute]
    )

    useEffect(() => {
        if (immediate) {
            refetch()
        }
        return abort
    }, [immediate, refetch])

    return { refetch, abort, called, loading, error, data }
}
