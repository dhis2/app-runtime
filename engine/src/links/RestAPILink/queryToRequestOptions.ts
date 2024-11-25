import type { FetchType } from '../../types/ExecuteOptions'
import type { ResolvedResourceQuery } from '../../types/Query'
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
        case 'json-patch':
            return 'PATCH'
        case 'replace':
            return 'PUT'
        case 'delete':
            return 'DELETE'
        default:
            throw new Error(`Unknown type ${type}`)
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
