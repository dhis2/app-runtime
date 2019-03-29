import React from 'react'
import { FetchError } from '../types/FetchError'
import { useQuery } from '../hooks/useQuery'
import { QueryDefinition } from '../types/Query'

interface QueryRenderInput {
    loading: boolean
    error: FetchError | undefined
    data: Object | undefined
}
interface QueryInput {
    query: QueryDefinition
    children: (input: QueryRenderInput) => React.ReactNode
}

export const Query = ({ query, children }: QueryInput): React.ReactNode => {
    const [loading, error, data] = useQuery(query)

    return children({ loading, error, data })
}
