import type { FetchType } from '../../types/ExecuteOptions'
import { JSON_PATCH_CONTENT_TYPE } from '../../types/JSONPatch'
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

export const requestOptionsToFetchType = (init: RequestInit): FetchType => {
    const method = init.method ?? 'GET'
    const headers = Object.fromEntries(new Headers(init.headers).entries())
    const contentType = headers['content-type']
    switch (method) {
        case 'GET':
            return 'read'
        case 'POST':
            return 'create'
        case 'PATCH':
            if (contentType === JSON_PATCH_CONTENT_TYPE) {
                return 'json-patch'
            }
            return 'update'
        case 'DELETE':
            return 'delete'
        default:
            throw new Error(`Unsupported request method ${method}`)
    }
}

export const queryToRequestOptions = (
    type: FetchType,
    query: ResolvedResourceQuery,
    signal: AbortSignal | null | undefined
): RequestInit => {
    const contentType = requestContentType(type, query)

    return {
        method: getMethod(type),
        body: requestBodyForContentType(contentType, query),
        headers: requestHeadersForContentType(contentType),
        signal,
    }
}
