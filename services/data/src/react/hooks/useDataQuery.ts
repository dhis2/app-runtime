import { useState, useRef } from 'react'
import { useQuery } from 'react-query'
import { Query, QueryOptions } from '../../engine'
import { FetchError } from '../../engine/types/FetchError'
import { QueryRenderInput, QueryRefetchFunction } from '../../types'
import { useDataEngine } from './useDataEngine'
import { useStaticInput } from './useStaticInput'

export const useDataQuery = (
    query: Query,
    {
        onComplete: userOnSuccess,
        onError: userOnError,
        variables: initialVariables = {},
        lazy: initialLazy = false,
    }: QueryOptions = {}
): QueryRenderInput => {
    const [variables, setVariables] = useState(initialVariables)
    const [enabled, setEnabled] = useState(!initialLazy)
    const [staticQuery] = useStaticInput<Query>(query, {
        warn: true,
        name: 'query',
    })

    /**
     * User callbacks and refetch handling
     */

    const refetchCallback = useRef<((data: any) => void) | null>(null)
    const onSuccess = (data: any) => {
        if (refetchCallback.current) {
            refetchCallback.current(data)
            refetchCallback.current = null
        }

        if (userOnSuccess) {
            userOnSuccess(data)
        }
    }

    const onError = (error: FetchError) => {
        // If we'd want to reject on errors we'd call the cb with the error here
        if (refetchCallback.current) {
            refetchCallback.current = null
        }

        if (userOnError) {
            userOnError(error)
        }
    }

    /**
     * Setting up react-query
     */

    const engine = useDataEngine()
    const queryKey = [staticQuery, variables]
    const queryFn = () => engine.query(staticQuery, { variables })
    let response

    try {
        response = useQuery(queryKey, queryFn, {
            enabled,
            onSuccess,
            onError,
        })
    } catch (e) {
        response = {
            isIdle: false,
            isLoading: false,
            error: e,
            data: undefined,
            refetch: () => {},
        }
    }

    const {
        isIdle,
        isLoading: loading,
        error,
        data,
        refetch: queryRefetch,
    } = response

    /**
     * Refetch allows a user to update the variables or just
     * trigger a refetch of the query with the current variables.
     */

    const refetch: QueryRefetchFunction = newVariables => {
        /**
         * If there are no updates that will trigger an automatic refetch
         * we'll need to call react-query's refetch directly
         */
        if (enabled && !newVariables) {
            return queryRefetch({
                cancelRefetch: true,
                throwOnError: false,
            }).then(({ data }) => data)
        }

        if (!enabled) {
            setEnabled(true)
        }

        if (newVariables) {
            setVariables({ ...variables, ...newVariables })
        }

        // This promise does not currently reject on errors
        return new Promise(resolve => {
            refetchCallback.current = data => {
                resolve(data)
            }
        })
    }

    /**
     * react-query returns null or an error, but we return undefined
     * or an error, so this ensures consistency with the other types.
     */
    const ourError = error || undefined
    // A query is idle if it is lazy and no initial data is available.
    const ourCalled = !isIdle

    return {
        engine,
        called: ourCalled,
        loading,
        error: ourError,
        data,
        refetch,
    }
}
