import { useDataQuery } from '../hooks/useDataQuery'
import { Query } from '../engine/types/Query'
import { QueryRenderInput } from '../types'

interface QueryInput {
    query: Query
    children: (input: QueryRenderInput) => any
}

export const DataQuery = ({ query, children }: QueryInput) => {
    const queryState = useDataQuery(query)

    return children(queryState)
}
