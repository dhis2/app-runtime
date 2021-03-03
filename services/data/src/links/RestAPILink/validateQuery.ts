import { FetchType, ResolvedResourceQuery } from '../../engine'

const validatePagination = (
    query: ResolvedResourceQuery,
    warn: (...data: any[]) => void
): boolean => {
    if (query.params?.paging === false || query.params?.paging === 'false') {
        warn(
            'Data queries with paging=false are deprecated and should not be used!',
            query
        )
        return false
    }
    return true
}

const validateDeclarativeFields = (
    query: ResolvedResourceQuery,
    warn: (...data: any[]) => void
): boolean => {
    if (!query.params?.fields) {
        warn('Data queries should always specify fields to return', query)
        return false
    } else {
        let fields: Array<string> | undefined = undefined
        if (typeof query.params.fields === 'string') {
            fields = query.params.fields.split(',').map(field => field.trim())
        } else if (Array.isArray(query.params.fields)) {
            fields = query.params.fields.map(field => String(field).trim())
        }
        if (fields?.find(field => field.match(/(^\*$|^:.+)/))) {
            warn(
                'Data queries should not use wildcard or dynamic field groups',
                query.params.fields,
                query
            )
            return false
        }
    }
    return true
}

export const validateResourceQuery = (
    query: ResolvedResourceQuery,
    type: FetchType
): boolean => {
    let valid = true
    const warn =
        process.env.NODE_ENV === 'development' ? console.warn : () => undefined

    if (type === 'read') {
        valid = validatePagination(query, warn) && valid
        valid = validateDeclarativeFields(query, warn) && valid
    }

    return valid
}
