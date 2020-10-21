import { ResolvedResourceQuery, FetchType } from '../../engine'
import { queryToRequestHeaders } from './queryToRequestHeaders'

const getMethod = (type: FetchType): string => {
    switch (type) {
        case 'create':
            return 'POST'
        case 'read':
            return 'GET'
        case 'update':
            return 'PATCH'
        case 'replace':
            return 'PUT'
        case 'delete':
            return 'DELETE'
    }
}

export const queryToRequestOptions = (
    type: FetchType,
    query: ResolvedResourceQuery,
    signal?: AbortSignal
): RequestInit => ({
    method: getMethod(type),
    body: query.data ? JSON.stringify(query.data) : undefined,
    headers: queryToRequestHeaders(type, query),
    signal,
})
