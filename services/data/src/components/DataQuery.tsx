import { useDataQuery } from '../hooks/useDataQuery'
import { QueryRenderInput, QueryMap } from '../types/Query'

interface QueryInput {
    query: QueryMap
    children: (input: QueryRenderInput) => any
}

export const DataQuery = ({ query, children }: QueryInput) => {
    const { loading, error, data } = useDataQuery(query)

    return children({ loading, error, data })
}
