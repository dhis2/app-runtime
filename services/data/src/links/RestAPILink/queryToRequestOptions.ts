import { ResolvedResourceQuery, FetchType } from '../../engine'
import {
    requestContentType,
    requestBodyForContentType,
    requestHeadersForContentType,
} from './queryToRequestOptions/requestContentType'

const getMethod = (type: FetchType): string => {
    switch (type) {
        case 'create':
            return 'POST'
        case 'read':
            return 'GET'
        case 'update':
        case 'jsonPatch':
            return 'PATCH'
        case 'replace':
            return 'PUT'
        case 'delete':
            return 'DELETE'
        default:
            return ''
    }
}

export const queryToRequestOptions = (
    type: FetchType,
    query: ResolvedResourceQuery,
    signal?: AbortSignal
): RequestInit => {
    const contentType = requestContentType(type, query)

    return {
        method: getMethod(type),
        body: requestBodyForContentType(contentType, query),
        headers: requestHeadersForContentType(contentType),
        signal,
    }
}
