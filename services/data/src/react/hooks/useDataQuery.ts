import { useState, useRef, useCallback } from 'react'
import { useQuery } from 'react-query'
import { Query, QueryOptions } from '../../engine'
import { FetchError } from '../../engine/types/FetchError'
import { QueryRenderInput, QueryRefetchFunction } from '../../types'
import { stableVariablesHash } from './stableVariablesHash'
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
    const variablesHash = useRef<string | null>(null)
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

    const {
        isIdle,
        isFetching,
        isLoading,
        error,
        data,
        refetch: queryRefetch,
    } = useQuery(queryKey, queryFn, {
        enabled,
        onSuccess,
        onError,
    })

    /**
     * Refetch allows a user to update the variables or just
     * trigger a refetch of the query with the current variables.
     *
     * We're using useCallback to make the identity of the function
     * as stable as possible, so that it won't trigger excessive
     * rerenders when used for side-effects.
     */

    const refetch: QueryRefetchFunction = useCallback(
        newVariables => {
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

            if (newVariables) {
                // Use cached hash if it exists
                const currentHash =
                    variablesHash.current || stableVariablesHash(variables)

                const mergedVariables = { ...variables, ...newVariables }
                const mergedHash = stableVariablesHash(mergedVariables)
                const identical = currentHash === mergedHash

                if (identical && enabled) {
                    /**
                     * If the variables are identical and the query is enabled
                     * we'll need to trigger the refetch manually
                     */
                    return queryRefetch({
                        cancelRefetch: true,
                        throwOnError: false,
                    }).then(({ data }) => data)
                } else {
                    variablesHash.current = mergedHash
                    setVariables(mergedVariables)
                }
            }

            // Enable the query after the variables have been set to prevent extra request
            if (!enabled) {
                setEnabled(true)
            }

            // This promise does not currently reject on errors
            return new Promise(resolve => {
                refetchCallback.current = data => {
                    resolve(data)
                }
            })
        },
        [enabled, queryRefetch, variables]
    )

    /**
     * react-query returns null or an error, but we return undefined
     * or an error, so this ensures consistency with the other types.
     */
    const ourError = error || undefined

    return {
        engine,
        // A query is idle if it is lazy and no initial data is available.
        called: !isIdle,
        loading: isLoading,
        fetching: isFetching,
        error: ourError,
        data,
        refetch,
    }
}
