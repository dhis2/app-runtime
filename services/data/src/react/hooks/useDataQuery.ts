import { useState } from 'react'
import useSWR from 'swr'
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

    // TODO: Used as the cache key, this should be deterministically serialized
    const queryKey = JSON.stringify([staticQuery, variables])

    // The queryfn must return a promise that will either resolve to data or throw an error
    const engine = useDataEngine()
    const queryFn = () =>
        engine.query(staticQuery, { onComplete, onError, variables })

    const shouldFetch = () => (enabled ? queryKey : null)
    const { error, data } = useSWR(shouldFetch, queryFn)

    // Map our API to swr's API
    const done = data || error
    const loading = enabled && !done
    const called = enabled

    // Callback that allows updating the variables and enabling a lazy query
    // eslint-disable-next-line
    // @ts-ignore
    const refetch = newVariables => {
        if (newVariables) {
            setVariables({
                ...variables,
                ...newVariables,
            })
        }

        if (!enabled) {
            setEnabled(true)
        }
    }

    // eslint-disable-next-line
    // @ts-ignore: refetch does not return a promise currently
    return { engine, called, loading, error, data, refetch }
}
