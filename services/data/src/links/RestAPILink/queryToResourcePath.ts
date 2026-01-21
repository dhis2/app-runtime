import type { Config } from '@dhis2/app-service-config'
import {
    ResolvedResourceQuery,
    QueryParameters,
    QueryParameterValue,
    FetchType,
} from '../../engine'
import { RestAPILink } from '../RestAPILink'
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
            value.forEach((item) => {
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

const legacyPrefix = 'legacy::'
const isLegacy = (resource: string) => resource.startsWith(legacyPrefix)
const makeLegacyPath = (resource: string) => {
    switch (resource) {
        case 'legacy::bundledApps': {
            return 'dhis-web-apps/apps-bundle.json'
        }
        // Not necessary here, but brainstorming:
        // you can use whatever path you want 🤷
        default: {
            return resource.replace(legacyPrefix, '')
        }
    }
}

const skipApiVersion = (resource: string, config: Config): boolean => {
    if (resource === 'tracker' || resource.startsWith('tracker/')) {
        if (!config.serverVersion?.minor || config.serverVersion?.minor < 38) {
            return true
        }
    }

    // The `/api/ping` endpoint is unversioned
    if (resource === 'ping') {
        return true
    }

    return false
}

export const queryToResourcePath = (
    link: RestAPILink,
    query: ResolvedResourceQuery,
    type: FetchType
): string => {
    const { resource, id, params = {} } = query

    const apiBase = skipApiVersion(resource, link.config)
        ? link.unversionedApiPath
        : link.versionedApiPath

    const base = isAction(resource)
        ? makeActionPath(resource)
        : isLegacy(resource)
        ? makeLegacyPath(resource)
        : joinPath(apiBase, resource, id)

    validateResourceQuery(query, type)

    if (Object.keys(params).length) {
        return `${base}?${queryParametersToQueryString(params)}`
    }
    return base
}
