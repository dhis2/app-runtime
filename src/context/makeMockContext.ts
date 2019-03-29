import { fetchData } from '../utils/networkFetch'
import { joinPath } from '../utils/path'
import { ContextType, FetchFunction, MockContextInput } from '../types/Context'

const baseUrl = 'https://example.com'
const apiVersion = 42

export const makeMockContext = ({
    mockData,
}: MockContextInput): ContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    const mockFetch: FetchFunction = (query, options) => {
        if (mockData[query.resource]) {
            return Promise.resolve(mockData[query.resource])
        }
        throw new Error(`No mock provided for resource type ${query.resource}!`)
    }
    return {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: mockFetch,
    }
}
