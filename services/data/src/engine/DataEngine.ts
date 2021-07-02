import { getMutationFetchType } from './helpers/getMutationFetchType'
import { resolveDynamicQuery } from './helpers/resolveDynamicQuery'
import {
    validateResourceQuery,
    validateResourceQueries,
} from './helpers/validate'
import { DataEngineLink } from './types/DataEngineLink'
import { QueryExecuteOptions } from './types/ExecuteOptions'
import { JsonMap, JsonValue } from './types/JsonValue'
import { SingleMutation, SequentialMutation, Mutation } from './types/Mutation'
import { ParallelQuery, SequentialQuery, Query } from './types/Query'

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

    private queryParallel(
        query: ParallelQuery,
        { variables = {}, signal }: QueryExecuteOptions = {},
        resultSet: JsonValue = {}
    ): Promise<JsonMap> {
        const names = Object.keys(query)
        const queries = names
            .map(name => query[name])
            .map(q => resolveDynamicQuery(q, variables, resultSet))

        validateResourceQueries(queries, names)

        return Promise.all(
            queries.map(q => {
                return this.link.executeResourceQuery('read', q, {
                    signal,
                })
            })
        ).then(results => reduceResponses(results, names))
    }

    private async querySequentially(
        queries: SequentialQuery,
        queryExecuteOptions: QueryExecuteOptions = {}
    ): Promise<JsonMap> {
        let resultSet = {}

        for (let i = 0; i < queries.length; ++i) {
            const query = queries[i]
            resultSet = await this.queryParallel(
                query,
                queryExecuteOptions,
                resultSet
            ).then(data => Object.assign({}, resultSet, data))
        }

        return resultSet
    }

    public query(
        query: Query,
        queryExecuteOptions: QueryExecuteOptions = {}
    ): Promise<JsonMap> {
        let result

        if (Array.isArray(query)) {
            result = this.querySequentially(query, queryExecuteOptions)
        } else {
            result = this.queryParallel(query, queryExecuteOptions)
        }

        const { onComplete, onError } = queryExecuteOptions
        return result
            .then(data => {
                onComplete && onComplete(data)
                return data
            })
            .catch(error => {
                onError && onError(error)
                throw error
            })
    }

    public mutateSingle(
        mutation: SingleMutation,
        { variables = {}, signal }: QueryExecuteOptions = {},
        resultSet: JsonValue = {}
    ): Promise<JsonValue> {
        const query = resolveDynamicQuery(mutation, variables, resultSet)

        const type = getMutationFetchType(mutation)
        validateResourceQuery(type, query)

        const result = this.link.executeResourceQuery(type, query, {
            signal,
        })

        return result
    }

    private async mutateSequentially(
        mutations: SequentialMutation,
        queryExecuteOptions: QueryExecuteOptions = {}
    ): Promise<JsonMap> {
        let resultSet = {}

        for (let i = 0; i < mutations.length; ++i) {
            const [[name, mutation]] = Object.entries(mutations[i])

            resultSet = await this.mutateSingle(
                mutation,
                queryExecuteOptions,
                resultSet
            ).then(data => {
                return Object.assign({}, resultSet, { [name]: data })
            })
        }

        return resultSet as JsonMap
    }

    public mutate(
        mutation: Mutation,
        queryExecuteOptions: QueryExecuteOptions = {}
    ): Promise<JsonValue | JsonMap> {
        let result

        if (Array.isArray(mutation)) {
            result = this.mutateSequentially(
                mutation as SequentialMutation,
                queryExecuteOptions
            )
        } else {
            result = this.mutateSingle(
                mutation as SingleMutation,
                queryExecuteOptions
            )
        }

        const { onComplete, onError } = queryExecuteOptions
        return result
            .then(data => {
                onComplete && onComplete(data)
                return data
            })
            .catch(error => {
                onError && onError(error)
                throw error
            })
    }
}

export default DataEngine
