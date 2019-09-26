import { Query, QueryOptions } from '../../engine'
import { QueryRenderInput } from '../../types'
import { useDataQuery } from '../hooks'

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
