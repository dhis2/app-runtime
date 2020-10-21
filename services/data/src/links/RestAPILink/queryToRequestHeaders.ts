import { ResolvedResourceQuery, FetchType } from '../../engine'
import * as textPlainMatchers from './queryToRequestHeaders/textPlainMatchers'

const resourceExpectsTextPlain = (
    type: FetchType,
    query: ResolvedResourceQuery
) =>
    Object.values(textPlainMatchers).some(textPlainMatcher =>
        textPlainMatcher(type, query)
    )

export const contentTypeForResource = (
    type: FetchType,
    query: ResolvedResourceQuery
) => {
    if (resourceExpectsTextPlain(type, query)) {
        return 'text/plain'
    }

    if (query.data instanceof FormData) {
        return 'multipart/form-data'
    }

    return 'application/json'
}

export const queryToRequestHeaders = (
    type: FetchType,
    query: ResolvedResourceQuery
) => {
    if (!query.data) {
        return undefined
    }

    return {
        'Content-Type': contentTypeForResource(type, query),
    }
}
