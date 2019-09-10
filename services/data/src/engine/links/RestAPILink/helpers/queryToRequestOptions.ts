import { ResolvedResourceQuery } from '../../../types/Query'
import { FetchType } from '../../../types/ExecuteOptions'

const getMethod = (type: FetchType): string => {
    switch (type) {
        case 'create':
            return 'POST'
        case 'read':
            return 'GET'
        case 'update':
            return 'PATCH'
        case 'replace':
            return 'POST'
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
    body: data ? JSON.stringify(data) : null,
    headers: data
        ? {
              'Content-Type': 'application/json',
          }
        : undefined,
    signal,
})
