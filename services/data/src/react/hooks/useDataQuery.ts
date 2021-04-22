import { useState } from 'react'
import { useQuery } from 'react-query'
import { Query, QueryOptions, QueryVariables } from '../../engine'
import { QueryRenderInput } from '../../types'
import { useDataEngine } from './useDataEngine'
import { useStaticInput } from './useStaticInput'

export const useDataQuery = (
    query: Query,
    {
        onComplete,
        onError,
        variables: initialVariables = {},
        lazy = false,
    }: QueryOptions = {}
): QueryRenderInput => {
    const [variables, setVariables] = useState(initialVariables)
    const [enabled, setEnabled] = useState(!lazy)

    // Ensure the query is static
    const [staticQuery] = useStaticInput<Query>(query, {
        warn: true,
        name: 'query',
    })

    // Used as the cache key, deterministically serialized
    const queryKey = [staticQuery, variables]

    // The queryfn must return a promise that will either resolve to data or throw an error
    const engine = useDataEngine()
    const queryFn = () =>
        engine.query(staticQuery, { onComplete, onError, variables })

    const { isIdle, isLoading, error, data, refetch: queryRefetch } = useQuery(
        queryKey,
        queryFn,
        {
            enabled,
        }
    )

    // Map our API to react-query's API
    const loading = isLoading
    const called = !isIdle

    // Callback that allows updating the variables and enabling a lazy query
    const refetch = (newVariables: QueryVariables) => {
        if (newVariables) {
            setVariables({
                ...variables,
                ...newVariables,
            })
        }

        if (!enabled) {
            setEnabled(true)
        }

        return queryRefetch()
    }

    // eslint-disable-next-line
    // @ts-ignore: though refetch returns a promise, the type exported from
    // react-query isn't directly compatible with our expected type.
    return { engine, called, loading, error, data, refetch }
}
