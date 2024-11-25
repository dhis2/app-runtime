import { getMutationFetchType } from './helpers/getMutationFetchType'
import { resolveDynamicQuery } from './helpers/resolveDynamicQuery'
import {
    validateResourceQuery,
    validateResourceQueries,
} from './helpers/validate'
import type { DataEngineLink } from './types/DataEngineLink'
import type { QueryExecuteOptions } from './types/ExecuteOptions'
import type { JsonMap, JsonValue } from './types/JsonValue'
import type { Mutation } from './types/Mutation'
import type { Query } from './types/Query'

const reduceResponses = (responses: JsonValue[], names: string[]) =>
    responses.reduce<JsonMap>((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

export class DataEngine {
    private readonly link: DataEngineLink
    public constructor(link: DataEngineLink) {
        this.link = link
    }

    public query(
        query: Query,
        {
            variables = {},
            signal,
            onComplete,
            onError,
        }: QueryExecuteOptions = {}
    ): Promise<JsonMap> {
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
                const data = reduceResponses(results, names)
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
