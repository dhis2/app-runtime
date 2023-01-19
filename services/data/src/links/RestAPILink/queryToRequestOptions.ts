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

/**
 * Band-aid for the ping API, which can throw an error when being processed
 * as JSON. Hopefully this will be superseded by a new ping endpoint:
 * https://dhis2.atlassian.net/browse/DHIS2-14531
 */
const getAcceptHeader = (query: ResolvedResourceQuery): string => {
    if (query.resource === 'system/ping') {
        return 'text/plain'
    }

    return 'application/json'
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
        headers: {
            ...requestHeadersForContentType(contentType),
            Accept: getAcceptHeader(query),
        },
        signal,
    }
}
