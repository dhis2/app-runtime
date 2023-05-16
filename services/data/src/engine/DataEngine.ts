import { getMutationFetchType } from './helpers/getMutationFetchType'
import { resolveDynamicQuery } from './helpers/resolveDynamicQuery'
import {
    validateResourceQuery,
    validateResourceQueries,
} from './helpers/validate'
import { DataEngineLink } from './types/DataEngineLink'
import { QueryExecuteOptions } from './types/ExecuteOptions'
import { JsonValue } from './types/JsonValue'
import { Mutation } from './types/Mutation'
import { Query, QueryResultData } from './types/Query'

const reduceResponses = (responses: JsonValue[], names: string[]) =>
    responses.reduce<any>((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

export class DataEngine {
    private link: DataEngineLink
    public constructor(link: DataEngineLink) {
        this.link = link
    }

    public query<
        TQueryResultData extends QueryResultData<TQuery>,
        TQuery extends Query = Query
    >(
        query: TQuery,
        {
            variables = {},
            signal,
            onComplete,
            onError,
        }: QueryExecuteOptions<TQueryResultData> = {}
    ): Promise<TQueryResultData> {
        const names = Object.keys(query)
        const queries = names
            .map((name) => query[name])
            .map((q) => resolveDynamicQuery(q, variables))

        validateResourceQueries(queries, names)

        return Promise.all(
            queries.map((q) => {
                return this.link.executeResourceQuery('read', q, {
                    signal,
                })
            })
        )
            .then((results) => {
                const data: TQueryResultData = reduceResponses(results, names)
                onComplete && onComplete(data)
                return data
            })
            .catch((error) => {
                onError && onError(error)
                throw error
            })
    }

    public mutate(
        mutation: Mutation,
        {
            variables = {},
            signal,
            onComplete,
            onError,
        }: QueryExecuteOptions = {}
    ): Promise<JsonValue> {
        const query = resolveDynamicQuery(mutation, variables)

        const type = getMutationFetchType(mutation)
        validateResourceQuery(type, query)

        const result = this.link.executeResourceQuery(type, query, {
            signal,
        })
        return result
            .then((data) => {
                onComplete && onComplete(data)
                return data
            })
            .catch((error) => {
                onError && onError(error)
                throw error
            })
    }
}

export default DataEngine
