import React from 'react'
import { FetchError } from '../types/FetchError'
import { useQuery } from '../hooks/useQuery'
import { QueryDefinition, QueryRenderInput } from '../types/Query'

interface QueryInput {
    query: QueryDefinition
    children: (input: QueryRenderInput) => any
}

export const Query = ({ query, children }: QueryInput) => {
    const { loading, error, data } = useQuery(query)

    return children({ loading, error, data })
}
