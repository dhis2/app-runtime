import { Query, QueryOptions } from '../engine/types/Query'
import { QueryRenderInput } from '../types'

import { useQueryExecutor } from './useQueryExecutor'
import { useStaticInput } from './useStaticInput'
import { useDataEngine } from './useDataEngine'
import { useCallback } from 'react'

const empty = {}
export const useDataQuery = (
    query: Query,
    { onCompleted, onError, variables = empty }: QueryOptions = {}
): QueryRenderInput => {
    const engine = useDataEngine()
    const [theQuery] = useStaticInput<Query>(query, {
        warn: true,
        name: 'query',
    })
    const execute = useCallback(options => engine.query(theQuery, options), [
        engine,
        theQuery,
    ])
    const { refetch, loading, error, data } = useQueryExecutor({
        execute,
        variables,
        singular: true,
        immediate: true,
        onCompleted,
        onError,
    })

    return { engine, refetch, loading, error, data }
}
