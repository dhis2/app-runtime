import { Query, QueryOptions } from '../../engine'
import { QueryRenderInput } from '../../types'
import { useDataQuery } from '../hooks/useDataQuery'

interface QueryInput extends QueryOptions {
    query: Query
    children: (input: QueryRenderInput) => any
}

export const DataQuery = ({
    query,
    onComplete,
    onError,
    variables,
    lazy,
    children,
}: QueryInput) => {
    const queryState = useDataQuery(query, {
        onComplete,
        onError,
        variables,
        lazy,
    })

    return children(queryState)
}
