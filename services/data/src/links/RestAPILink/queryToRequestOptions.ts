import { ResolvedResourceQuery, FetchType } from '../../engine'
import { contentTypeForResource } from './contentTypeForResource'

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
    { data, resource }: ResolvedResourceQuery,
    signal?: AbortSignal
): RequestInit => ({
    method: getMethod(type),
    body: data ? JSON.stringify(data) : undefined,
    headers: data
        ? {
              'Content-Type': contentTypeForResource(resource),
          }
        : undefined,
    signal,
})
