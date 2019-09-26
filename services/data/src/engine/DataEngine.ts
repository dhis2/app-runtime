import { Query } from './types/Query'
import { resolveDynamicQuery, getMutationFetchType } from './helpers'
import {
    DataEngineLink,
    Mutation,
    QueryExecuteOptions,
    JsonValue,
    JsonMap,
} from './types'

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
        const queries = names.map(name => query[name])
        return Promise.all(
            queries.map(q => {
                const resolvedQuery = resolveDynamicQuery(q, variables)
                return this.link.executeResourceQuery('read', resolvedQuery, {
                    signal,
                })
            })
        )
            .then(results => {
                const data = reduceResponses(results, names)
                onComplete && onComplete(data)
                return data
            })
            .catch(error => {
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
        const result = this.link.executeResourceQuery(
            getMutationFetchType(mutation),
            query,
            {
                signal,
            }
        )
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
