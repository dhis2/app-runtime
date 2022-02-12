import {
    ResolvedResourceQuery,
    QueryParameters,
    QueryParameterValue,
    FetchType,
} from '../../engine'
import { joinPath } from './path'
import { validateResourceQuery } from './validateQuery'

const encodeQueryParameter = (param: QueryParameterValue): string => {
    if (Array.isArray(param)) {
        return param.map(encodeQueryParameter).join(',')
    }
    if (typeof param === 'string') {
        return encodeURIComponent(param)
    }
    if (typeof param === 'number' || typeof param === 'boolean') {
        return String(param)
    }
    if (typeof param === 'object') {
        throw new Error('Object parameter mappings not yet implemented')
    }
    throw new Error('Unknown parameter type')
}

type ExpandedParam = {
    key: string
    value: QueryParameterValue
}

const queryParametersMapToArray = (
    params: QueryParameters
): Array<ExpandedParam> =>
    Object.keys(params).reduce((out, key) => {
        const value = params[key]
        if (key === 'filter' && Array.isArray(value)) {
            value.forEach(item => {
                out.push({
                    key: 'filter',
                    value: item,
                })
            })
        } else if (params[key] !== null && params[key] !== undefined) {
            out.push({
                key,
                value: params[key],
            })
        }
        return out
    }, [] as Array<ExpandedParam>)

const queryParametersToQueryString = (params: QueryParameters): string => {
    const expandedParams = queryParametersMapToArray(params)

    return expandedParams
        .map(
            ({ key, value }) =>
                `${encodeURIComponent(key)}=${encodeQueryParameter(value)}`
        )
        .join('&')
}

const actionPrefix = 'action::'

const isAction = (resource: string) => resource.startsWith(actionPrefix)
const makeActionPath = (resource: string) =>
    joinPath(
        'dhis-web-commons',
        `${resource.substr(actionPrefix.length)}.action`
    )

const resolveResource = ({
    resource,
    resourceParams,
}: ResolvedResourceQuery): string => {
    if (!resourceParams || !resourceParams.length) {
        return resource
    }
    let resolvedResource = `${resource}`
    for (let i = 0; i < resourceParams.length; ++i) {
        resolvedResource = resolvedResource.replace(
            `{${i + 1}}`,
            resourceParams[i]
        )
    }
    return resolvedResource
}

export const queryToResourcePath = (
    apiPath: string,
    query: ResolvedResourceQuery,
    type: FetchType
): string => {
    const { id, params = {} } = query
    const resource = resolveResource(query)
    const base = isAction(resource)
        ? makeActionPath(resource)
        : joinPath(apiPath, resource, id)

    validateResourceQuery(query, type)

    if (Object.keys(params).length) {
        return `${base}?${queryParametersToQueryString(params)}`
    }
    return base
}
