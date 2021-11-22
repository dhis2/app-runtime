import { InvalidQueryError } from '../types/InvalidQueryError'
import { ResolvedResourceQuery } from '../types/Query'

const validQueryKeys = ['resource', 'resourceParams', 'id', 'params', 'data']
const validTypes = ['read', 'create', 'update', 'replace', 'delete']

const getResourceParamErrors = (query: ResolvedResourceQuery): string[] => {
    if (query.resource.match(/^{\d+}$/)) {
        return [`Query resource ${query.resource} is invalid`]
    }
    const resourcePlaceholders = [...query.resource.matchAll(/{(\d+)}/gi)]

    const errors = []
    let placeholderIndex = 0

    if (
        query.resourceParams &&
        (!Array.isArray(query.resourceParams) ||
            query.resourceParams.some(param => typeof param !== 'string'))
    ) {
        return ['Query field resourceParams must be an array of strings']
    }
    if (!resourcePlaceholders.length) {
        if (query.resourceParams?.length) {
            return [
                'Query field resourceParams is only applicable with a parameterized resource string',
            ]
        }
    } else if (resourcePlaceholders.length !== query.resourceParams?.length) {
        return [
            `Found ${resourcePlaceholders.length} placeholders in the resource string but ${query.resourceParams?.length} resourceParams were provided`,
        ]
    }
    while (resourcePlaceholders[placeholderIndex]) {
        const fromOneIndex = placeholderIndex + 1
        const placeholderMatch = resourcePlaceholders[placeholderIndex]
        const placeholderValue = placeholderMatch[1]

        if (placeholderMatch.index || placeholderMatch.index === 0) {
            const end = placeholderMatch.index + placeholderMatch[0].length
            if (
                (placeholderMatch.index > 0 &&
                    query.resource[placeholderMatch.index - 1] !== '/') ||
                (end < query.resource.length && query.resource[end] !== '/')
            ) {
                errors.push(
                    `Resource parameter ${placeholderMatch[0]} must be preceded and followed by / characters`
                )
            }
        }

        if (placeholderValue !== String(fromOneIndex)) {
            return [
                'Resource contains parameters which are not in increasing order',
            ]
        }
        const resourceParam = query.resourceParams?.[placeholderIndex]

        if (!resourceParam) {
            errors.push(
                `Resource contains parameter {${placeholderValue}}, but no matching resourceParam was provided`
            )
        }

        if (resourceParam?.includes('/')) {
            errors.push(
                `Resource parameter ${resourceParam} cannot contain a / character`
            )
        }

        placeholderIndex += 1
    }

    return errors
}

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

    errors.push(...getResourceParamErrors(query))

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
    const invalidKeys = Object.keys(query).filter(
        k => !validQueryKeys.includes(k)
    )
    invalidKeys.forEach(k => {
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
                    e => `[${names[i]}] ${e}`
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
