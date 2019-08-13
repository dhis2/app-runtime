import { useDataQuery } from '../hooks/useDataQuery'
import { QueryRenderInput, Query } from '../types/Query'

interface QueryInput {
    query: Query
    children: (input: QueryRenderInput) => any
}

export const DataQuery = ({ query, children }: QueryInput) => {
    const queryState = useDataQuery(query)

    return children(queryState)
}
