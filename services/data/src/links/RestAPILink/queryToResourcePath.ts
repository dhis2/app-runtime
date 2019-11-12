import {
    ResolvedResourceQuery,
    QueryParameters,
    QueryParameterValue,
    QueryParameterSingularOrAliasedValue,
} from '../../engine'
import { joinPath } from './path'

const encodeQueryParameterValue = (
    value: QueryParameterSingularOrAliasedValue
): string => {
    if (typeof value === 'string') {
        return encodeURIComponent(value)
    }
    if (typeof value === 'number') {
        return String(value)
    }
    if (typeof value === 'object') {
        throw new Error('Object parameter mappings not yet implemented')
    }
    throw new Error('Unknown parameter type')
}

const encodeSingularQueryParameter = (
    key: string,
    value: QueryParameterSingularOrAliasedValue
) => `${encodeURIComponent(key)}=${encodeQueryParameterValue(value)}`

const encodeQueryParameter = (key: string, value: QueryParameterValue) => {
    if (value === undefined) {
        return undefined
    }
    if (Array.isArray(value)) {
        return value.map(v => encodeSingularQueryParameter(key, v)).join('&')
    }
    return encodeSingularQueryParameter(key, value)
}

const queryParametersToQueryString = (params: QueryParameters) =>
    Object.keys(params)
        .filter(key => key && params[key])
        .map(key => encodeQueryParameter(key, params[key]))
        .join('&')

const actionPrefix = 'action::'

const isAction = (resource: string) => resource.startsWith(actionPrefix)
const makeActionPath = (resource: string) =>
    joinPath(
        'dhis-web-commons',
        `${resource.substr(actionPrefix.length)}.action`
    )

export const queryToResourcePath = (
    apiPath: string,
    { resource, id, params = {} }: ResolvedResourceQuery
): string => {
    const base = isAction(resource)
        ? makeActionPath(resource)
        : joinPath(apiPath, resource, id)

    if (Object.keys(params).length) {
        return `${base}?${queryParametersToQueryString(params)}`
    }
    return base
}
