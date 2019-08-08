import { fetchData } from '../utils/networkFetch'
import { joinPath } from '../utils/path'
import { ContextType, ContextInput } from '../types/Context'
import { queryToResourceUrl } from '../utils/queryToResourceUrl'

export const makeContext = ({
    baseUrl,
    apiVersion,
}: ContextInput): ContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    const context: ContextType = {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: (query, options) =>
            fetchData(joinPath(queryToResourceUrl(query, context)), options),
    }

    return context
}
