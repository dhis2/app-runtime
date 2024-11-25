import {
    QueryVariables,
    ResourceQuery,
    ResolvedResourceQuery,
} from '../types/Query'

export const resolveDynamicQuery = (
    { resource, id, data, params }: ResourceQuery,
    variables: QueryVariables
): ResolvedResourceQuery => ({
    resource,
    id: typeof id === 'function' ? id(variables) : id,
    data: typeof data === 'function' ? data(variables) : data,
    params: typeof params === 'function' ? params(variables) : params,
})
