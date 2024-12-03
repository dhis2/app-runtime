import { useState, useRef, useCallback, useDebugValue } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
    Query,
    QueryOptions,
    QueryResult,
    QueryVariables,
} from '../../engine'
import type { FetchError } from '../../engine/types/FetchError'
import type { QueryRenderInput, QueryRefetchFunction } from '../../types'
import { mergeAndCompareVariables } from './mergeAndCompareVariables'
import { useDataEngine } from './useDataEngine'
import { useStaticInput } from './useStaticInput'

type QueryState = {
    enabled: boolean
    variables?: QueryVariables
    variablesHash?: string
    refetchCallback?: (data: any) => void
}

export const useDataQuery = <TQueryResult = QueryResult>(
    query: Query,
    {
        onComplete: userOnSuccess,
        onError: userOnError,
        variables: initialVariables = {},
        lazy: initialLazy = false,
    }: QueryOptions<TQueryResult> = {}
): QueryRenderInput<TQueryResult> => {
    const [staticQuery] = useStaticInput<Query>(query, {
        warn: true,
        name: 'query',
    })
    const [variablesUpdateCount, setVariablesUpdateCount] = useState(0)

    const queryState = useRef<QueryState>({
        variables: initialVariables,
        variablesHash: undefined,
        enabled: !initialLazy,
        refetchCallback: undefined,
    })

    /**
     * Display current query state and refetch count in React DevTools
     */

    useDebugValue(
        {
            variablesUpdateCount,
            enabled: queryState.current.enabled,
            variables: queryState.current.variables,
        },
        (debugValue) => JSON.stringify(debugValue)
    )

    /**
     * User callbacks and refetch handling
     */

    const onSuccess = (data: any) => {
        queryState.current.refetchCallback?.(data)
        queryState.current.refetchCallback = undefined

        if (userOnSuccess) {
            userOnSuccess(data)
        }
    }

    const onError = (error: FetchError) => {
        // If we'd want to reject on errors we'd call the cb with the error here
        queryState.current.refetchCallback = undefined

        if (userOnError) {
            userOnError(error)
        }
    }

    /**
     * Setting up react-query
     */

    const engine = useDataEngine()
    const queryKey = [staticQuery, queryState.current.variables]
    const queryFn = () =>
        engine.query(staticQuery, { variables: queryState.current.variables })

    const {
        status,
        fetchStatus,
        error,
        data,
        refetch: queryRefetch,
    } = useQuery({ queryKey, queryFn, 
        enabled: queryState.current.enabled,
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
        (newVariables) => {
            const { identical, mergedVariables, mergedVariablesHash } =
                mergeAndCompareVariables(
                    queryState.current.variables,
                    newVariables,
                    queryState.current.variablesHash
                )

            /**
             * If there are no updates that will trigger an automatic refetch
             * we'll need to call react-query's refetch directly
             */
            if (queryState.current.enabled && identical) {
                return queryRefetch({
                    cancelRefetch: true,
                    throwOnError: false,
                }).then(({ data }) => data)
            }

            queryState.current.variables = mergedVariables
            queryState.current.variablesHash = mergedVariablesHash
            queryState.current.enabled = true

            // This promise does not currently reject on errors
            const refetchPromise = new Promise<TQueryResult>((resolve) => {
                queryState.current.refetchCallback = (data) => {
                    resolve(data)
                }
            })

            // Trigger a react-query refetch by incrementing variablesUpdateCount state
            setVariablesUpdateCount((prevCount) => prevCount + 1)

            return refetchPromise
        },
        [queryRefetch]
    )

    /**
     * react-query returns null or an error, but we return undefined
     * or an error, so this ensures consistency with the other types.
     */
    const ourError = error || undefined

    return {
        engine,
        // A query has not been called if it is lazy (fetchStatus = 'idle') and no initial data is available (status = 'loading').
        // https://tanstack.com/query/v4/docs/framework/react/guides/queries
        called: !(status === 'loading' && fetchStatus === 'idle'),
        // 'loading' should only be true when actively fetching (fetchStatus = 'fetching') while there is no data yet (status = 'loading').
        // If there is already data for the query, then 'loading' will not become 'true' when refetching, so the previous data can still be
        // displayed while new data is fetched in the background
        loading: fetchStatus === 'fetching' && status === 'loading',
        // 'fetching' reflects the fetching behavior behind the scenes
        fetching: fetchStatus === 'fetching',
        error: ourError,
        data,
        refetch,
    }
}
