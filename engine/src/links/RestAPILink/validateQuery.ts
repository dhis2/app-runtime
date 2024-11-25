import type { FetchType } from '../../types/ExecuteOptions'
import type { ResolvedResourceQuery } from '../../types/Query'
import { normativeMetadataResources } from './metadataResources'

const validatePagination = (
    query: ResolvedResourceQuery,
    warn: (...data: any[]) => void
): boolean => {
    if (!normativeMetadataResources.includes(query.resource)) {
        return true
    }
    if (query.params?.paging === false || query.params?.paging === 'false') {
        warn(
            'Data queries with paging=false are deprecated and should not be used!',
            query
        )
        return false
    }

    // TODO: validate sub-resource pagination (i.e. fields=users~paging(1,50)[name] )

    return true
}

const validateDeclarativeFields = (
    query: ResolvedResourceQuery,
    warn: (...data: any[]) => void
): boolean => {
    if (!normativeMetadataResources.includes(query.resource)) {
        return true
    }
    if (!query.params?.fields) {
        warn('Data queries should always specify fields to return', query)
        return false
    } else {
        let fields: Array<string> | undefined = undefined
        if (typeof query.params.fields === 'string') {
            fields = query.params.fields.split(',').map((field) => field.trim())
        } else if (Array.isArray(query.params.fields)) {
            fields = query.params.fields.map((field) => String(field).trim())
        }
        if (fields?.find((field) => /(^\*$|^:.+)/.test(field)))) {
            warn(
                'Data queries should not use wildcard or dynamic field groups',
                query.params.fields,
                query
            )
            return false
        }
    }

    // TODO: validate sub-resource wildcard fields (i.e. fields=users[*])
    return true
}

export const validateResourceQuery = (
    query: ResolvedResourceQuery,
    type: FetchType
): boolean => {
    let valid = true

    if (process.env.NODE_ENV === 'development') {
        // Support build-time dead code elimination in production
        const warn = console.warn
        if (type === 'read') {
            valid = validatePagination(query, warn) && valid
            valid = validateDeclarativeFields(query, warn) && valid
        }
    }

    return valid
}
