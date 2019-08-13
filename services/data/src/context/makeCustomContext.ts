import { joinPath } from '../utils/path'
import { ContextType, FetchFunction } from '../types/Context'
import { QueryDefinition } from '../types/Query'
import { FetchErrorPayload } from '../types/FetchError'

const baseUrl = 'https://example.com'
const apiVersion = 42

export type CustomResourceLiteral =
    | string
    | number
    | boolean
    | object
    | FetchErrorPayload
export type CustomResourceFactory = (
    query: QueryDefinition,
    options?: RequestInit
) => Promise<CustomResourceLiteral>
export type CustomResource = CustomResourceLiteral | CustomResourceFactory
export interface CustomContextData {
    [resourceName: string]: CustomResource
}
export interface CustomContextOptions {
    loadForever?: boolean
    failOnMiss?: boolean
    options?: RequestInit
}

const resolveCustomResource = async (
    customResource: CustomResource,
    query: QueryDefinition,
    { failOnMiss, options }: CustomContextOptions
): Promise<CustomResource> => {
    switch (typeof customResource) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'object':
            return customResource
        case 'function':
            // function
            const result = await customResource(query, options)
            if (!result && failOnMiss) {
                throw new Error(
                    `The custom function for resource ${query.resource} must always return a value but returned ${result}`
                )
            }
            return result || {}
        default:
            // should be unreachable
            throw new Error(`Unknown resource type ${typeof customResource}`)
    }
}

export const makeCustomContext = (
    customData: CustomContextData,
    { failOnMiss = true, loadForever = false }: CustomContextOptions = {}
): ContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    const customFetch: FetchFunction = async (query, options) => {
        const customResource = customData[query.resource]
        if (!customResource) {
            if (failOnMiss) {
                throw new Error(
                    `No data provided for resource type ${query.resource}!`
                )
            }
            return Promise.resolve({})
        }

        return await resolveCustomResource(customResource, query, {
            failOnMiss,
            options,
        })
    }
    const foreverLoadingFetch: FetchFunction = async () => {
        return new Promise(() => {}) // Load forever
    }
    const context = {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: loadForever ? foreverLoadingFetch : customFetch,
    }
    return context
}
