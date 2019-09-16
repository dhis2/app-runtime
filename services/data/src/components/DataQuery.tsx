import { useDataQuery } from '../hooks/useDataQuery'
import { Query, QueryOptions } from '../engine/types/Query'
import { QueryRenderInput } from '../types'

interface QueryInput extends QueryOptions {
    query: Query
    children: (input: QueryRenderInput) => any
}

export const DataQuery = ({
    query,
    onComplete,
    onError,
    variables,
    children,
}: QueryInput) => {
    const queryState = useDataQuery(query, {
        onComplete,
        onError,
        variables,
    })

    return children(queryState)
}
