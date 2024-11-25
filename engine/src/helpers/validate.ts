import { InvalidQueryError } from '../errors/InvalidQueryError'
import { ResolvedResourceQuery } from '../types/Query'

const validQueryKeys = ['resource', 'id', 'params', 'data']
const validTypes = [
    'read',
    'create',
    'update',
    'replace',
    'delete',
    'json-patch',
]

export const getResourceQueryErrors = (
    type: string,
    query: ResolvedResourceQuery
): string[] => {
    if (!validTypes.includes(type)) {
        return [`Unknown query or mutation type ${type}`]
    }
    if (typeof query !== 'object') {
        return ['A query or mutation must be a javascript object']
    }

    const errors: string[] = []

    if (!query.resource || typeof query.resource !== 'string') {
        errors.push('Property resource must be a string')
    }

    if (type === 'create' && query.id) {
        errors.push("Mutation type 'create' does not support property 'id'")
    }
    if (query.id && typeof query.id !== 'string') {
        errors.push('Property id must be a string')
    }

    if (query.params && typeof query.params !== 'object') {
        errors.push('Property params must be an object')
    }

    if (type === 'delete' && query.data) {
        errors.push("Mutation type 'delete' does not support property 'data'")
    }
    if (type === 'json-patch' && !Array.isArray(query.data)) {
        errors.push(
            "Mutation type 'json-patch' requires property 'data' to be of type Array"
        )
    }
    const invalidKeys = Object.keys(query).filter(
        (k) => !validQueryKeys.includes(k)
    )
    invalidKeys.forEach((k) => {
        errors.push(`Property ${k} is not supported`)
    })

    return errors
}

export const validateResourceQueries = (
    queries: ResolvedResourceQuery[],
    names: string[] = []
): void => {
    if (names.length !== queries.length) {
        for (let i = names.length; i < queries.length; ++i) {
            names.push('query#' + i)
        }
    }
    const errors = queries.reduce(
        (errors: string[], query, i) =>
            errors.concat(
                getResourceQueryErrors('read', query).map(
                    (e) => `[${names[i]}] ${e}`
                )
            ),
        []
    )

    if (errors.length) {
        throw new InvalidQueryError(errors)
    }
}

export const validateResourceQuery = (
    type: string,
    query: ResolvedResourceQuery
): void => {
    const errors = getResourceQueryErrors(type, query)
    if (errors.length) {
        throw new InvalidQueryError(errors)
    }
}
