import { useQuery } from '../hooks/useQuery'
import { QueryRenderInput, QueryMap } from '../types/Query'

interface QueryInput {
    query: QueryMap
    children: (input: QueryRenderInput) => any
}

export const Query = ({ query, children }: QueryInput) => {
    const { loading, error, data } = useQuery(query)

    return children({ loading, error, data })
}
