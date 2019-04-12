import { fetchData } from '../utils/networkFetch'
import { joinPath } from '../utils/path'
import { ContextType, FetchFunction } from '../types/Context'
import { QueryDefinition } from '../types/Query'
import { FetchErrorPayload } from '../types/FetchError'

const baseUrl = 'https://example.com'
const apiVersion = 42

export type OfflineResourceLiteral =
    | string
    | number
    | boolean
    | object
    | FetchErrorPayload
export type OfflineResourceFactory = (
    query: QueryDefinition
) => Promise<OfflineResourceLiteral>
export type OfflineResource = OfflineResourceLiteral | OfflineResourceFactory
export interface OfflineContextData {
    [resourceName: string]: OfflineResource
}
export type OfflineContextOptions = {
    failOnMiss?: boolean
}

const resolveOffline = async (
    offlineResource: OfflineResource,
    query: QueryDefinition,
    { failOnMiss }: OfflineContextOptions
): Promise<OfflineResource> => {
    switch (typeof offlineResource) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'object':
            return offlineResource
        case 'function':
            // function
            const result = await offlineResource(query)
            if (!result && failOnMiss) {
                throw new Error(
                    `The offline function for resource ${
                        query.resource
                    } must always return a value but returned ${result}`
                )
            }
            return result || {}
        default:
            // should be unreachable
            throw new Error(`Unknown resource type ${typeof offlineResource}`)
    }
}

export const makeOfflineContext = (
    offlineData: OfflineContextData,
    { failOnMiss = true }: OfflineContextOptions = {}
): ContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    const offlineFetch: FetchFunction = async query => {
        const offlineResource = offlineData[query.resource]
        if (!offlineResource) {
            if (failOnMiss) {
                throw new Error(
                    `No data provided for resource type ${query.resource}!`
                )
            }
            return Promise.resolve({})
        }

        return await resolveOffline(offlineResource, query, { failOnMiss })
    }
    const context = {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: offlineFetch,
    }
    return context
}
