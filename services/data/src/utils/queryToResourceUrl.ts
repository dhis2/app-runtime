import {
    QueryDefinition,
    QueryParameters,
    QueryParameterValue,
} from '../types/Query'
import { ContextType } from '../types/Context'
import { joinPath } from './path'

const encodeQueryParameter = (param: QueryParameterValue): string => {
    if (Array.isArray(param)) {
        return param.map(encodeQueryParameter).join(',')
    }
    if (typeof param === 'string') {
        return encodeURIComponent(param)
    }
    if (typeof param === 'number') {
        return String(param)
    }
    if (typeof param === 'object') {
        throw new Error('Object parameter mappings not yet implemented')
    }
    throw new Error('Unknown parameter type')
}
const queryParametersToQueryString = (params: QueryParameters) =>
    Object.keys(params)
        .filter(key => key && params[key])
        .map(
            key =>
                `${encodeURIComponent(key)}=${encodeQueryParameter(
                    params[key]
                )}`
        )
        .join('&')

const actionPrefix = 'action::'

const isAction = (resource: string) => resource.startsWith(actionPrefix)
const makeActionURL = (baseUrl: string, resource: string) =>
    joinPath(
        baseUrl,
        'dhis-web-commons',
        `${resource.substr(actionPrefix.length)}.action`
    )

export const queryToResourceUrl = (
    { resource, ...params }: QueryDefinition,
    { baseUrl, apiUrl }: ContextType
): string => {
    const base = isAction(resource)
        ? makeActionURL(baseUrl, resource)
        : joinPath(apiUrl, resource)

    if (Object.keys(params).length) {
        return `${base}?${queryParametersToQueryString(params)}`
    }
    return base
}
