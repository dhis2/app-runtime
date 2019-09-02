import { Query, QueryOptions, QueryRenderInput } from '../types/Query'
import { useDataFetcher } from './useDataFetcher'
import { JsonValue } from '../types/JsonValue'
import { useStaticInput } from './useStaticInput'
import { FetchDetails } from '../types/DataFetcher'

const reduceResponses = (responses: any[], names: string[]) =>
    responses.reduce((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

const makeFetchDetails = (query: Query): FetchDetails[] =>
    Object.values(query).reduce<FetchDetails[]>(
        (details, { resource, ...params }) => {
            details.push({
                type: 'read',
                resource: resource,
                params,
            })
            return details
        },
        []
    )

const empty = {}
export const useDataQuery = (
    query: Query,
    { onCompleted, onError, variables = empty }: QueryOptions = {}
): QueryRenderInput => {
    const [theQuery] = useStaticInput<Query>(query, 'query')
    const { refetch, loading, error, data } = useDataFetcher({
        details: makeFetchDetails(theQuery),
        variables,
        singular: true,
        immediate: true,
        transformData: (responses: JsonValue[]) =>
            reduceResponses(responses, Object.keys(theQuery)),
        onCompleted,
        onError,
    })

    return { refetch, loading, error, data }
}
