import { JsonValue } from '../types/JsonValue'
import {
    QueryVariables,
    ResourceQuery,
    ResolvedResourceQuery,
} from '../types/Query'

export const resolveDynamicQuery = (
    { resource, id, data, params }: ResourceQuery,
    variables: QueryVariables,
    resultSet?: JsonValue
): ResolvedResourceQuery => ({
    resource,
    id: typeof id === 'function' ? id(variables, resultSet) : id,
    data: typeof data === 'function' ? data(variables, resultSet) : data,
    params:
        typeof params === 'function' ? params(variables, resultSet) : params,
})
