import { fetchData } from '../utils/networkFetch'
import { joinPath } from '../utils/path'
import { ContextType, FetchFunction } from '../types/Context'
import { QueryDefinition } from '../types/Query'
import { FetchErrorPayload } from '../types/FetchError'

const baseUrl = 'https://example.com'
const apiVersion = 42

export type MockResourceLiteral =
    | string
    | number
    | boolean
    | object
    | FetchErrorPayload
export type MockResourceFactory = (
    query: QueryDefinition
) => Promise<MockResourceLiteral>
export type MockResource = MockResourceLiteral | MockResourceFactory
export interface MockContextData {
    [resourceName: string]: MockResource
}
export type MockContextOptions = {
    failOnMiss?: boolean
}

const resolveMock = async (
    mockResource: MockResource,
    query: QueryDefinition,
    { failOnMiss }: MockContextOptions
): Promise<MockResource> => {
    switch (typeof mockResource) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'object':
            return mockResource
        case 'function':
            // function
            const result = await mockResource(query)
            if (!result && failOnMiss) {
                throw new Error(
                    `The mock function for resource ${
                        query.resource
                    } must always return a value but returned ${result}`
                )
            }
            return result || {}
        default:
            // should be unreachable
            throw new Error(`Unknown mock type ${typeof mockResource}`)
    }
}

export const makeMockContext = (
    mockData: MockContextData,
    { failOnMiss = true }: MockContextOptions = {}
): ContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    const mockFetch: FetchFunction = async query => {
        const mockResource = mockData[query.resource]
        if (!mockResource) {
            if (failOnMiss) {
                throw new Error(
                    `No mock provided for resource type ${query.resource}!`
                )
            }
            return Promise.resolve({})
        }

        return await resolveMock(mockResource, query, { failOnMiss })
    }
    const context = {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: mockFetch,
    }
    return context
}
