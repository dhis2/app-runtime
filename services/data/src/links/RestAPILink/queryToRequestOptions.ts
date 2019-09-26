import { ResolvedResourceQuery, FetchType } from '../../engine'

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
    { data }: ResolvedResourceQuery,
    signal?: AbortSignal
): RequestInit => ({
    method: getMethod(type),
    body: data ? JSON.stringify(data) : undefined,
    headers: data
        ? {
              'Content-Type': 'application/json',
          }
        : undefined,
    signal,
})
