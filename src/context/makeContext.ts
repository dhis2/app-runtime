import { fetchData } from '../utils/networkFetch'
import { joinPath } from '../utils/path'
import { ContextType, ContextInput } from '../types/Context'
import { queryToResourcePath } from '../utils/queryToResourcePath'

export const makeContext = ({
    baseUrl,
    apiVersion,
}: ContextInput): ContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    return {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: (query, options) =>
            fetchData(joinPath(apiUrl, queryToResourcePath(query)), options),
    }
}
