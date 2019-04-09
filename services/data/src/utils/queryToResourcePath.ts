import {
    QueryDefinition,
    QueryParameters,
    QueryParameterValue,
} from '../types/Query'

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

export const queryToResourcePath = ({
    resource,
    ...params
}: QueryDefinition): string => {
    if (Object.keys(params).length) {
        return `${resource}?${queryParametersToQueryString(params)}`
    }
    return resource
}
