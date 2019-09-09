import { ResolvedResourceQuery } from '../../../types/Query'
import { joinPath } from './path'
import {
    QueryParameters,
    QueryParameterValue,
} from '../../../types/QueryParameters'

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
