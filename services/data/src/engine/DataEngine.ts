import { getMutationFetchType } from './helpers/getMutationFetchType'
import { resolveDynamicQuery } from './helpers/resolveDynamicQuery'
import {
    validateResourceQuery,
    validateResourceQueries,
} from './helpers/validate'
import { DataEngineLink } from './types/DataEngineLink'
import { QueryExecuteOptions } from './types/ExecuteOptions'
import { JsonMap, JsonValue } from './types/JsonValue'
import { Mutation } from './types/Mutation'
import type { Query, ResourceQuery } from './types/Query'

const reduceResponses = (responses: JsonValue[], names: string[]) =>
    responses.reduce<JsonMap>((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

export class DataEngine {
    private link: DataEngineLink
    public constructor(link: DataEngineLink) {
        this.link = link
    }

    // Overload 1: When no generic is provided, accept any Query and return inferred type
    public query(
        query: Query,
        options?: QueryExecuteOptions
    ): Promise<Record<keyof typeof query, unknown>>

    // Overload 2: When generic is provided, enforce that query keys match the generic keys
    public query<T extends Record<string, unknown>>(
        query: Record<keyof T, ResourceQuery>,
        options?: QueryExecuteOptions
    ): Promise<T>

    public query<TResult extends Record<string, unknown>>(
        query: Query,
        {
            variables = {},
            signal,
            onComplete,
            onError,
        }: QueryExecuteOptions = {}
    ): Promise<TResult | Record<keyof typeof query, unknown>> {
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
                return data as TResult | Record<keyof typeof query, unknown>
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
