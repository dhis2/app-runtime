import { getMutationFetchType } from './helpers/getMutationFetchType'
import { resolveDynamicQuery } from './helpers/resolveDynamicQuery'
import {
    validateResourceQuery,
    validateResourceQueries,
} from './helpers/validate'
import { DataEngineCache } from './types/DataEngineCache'
import { DataEngineLink } from './types/DataEngineLink'
import { QueryExecuteOptions } from './types/ExecuteOptions'
import { JsonMap, JsonValue } from './types/JsonValue'
import { Mutation } from './types/Mutation'
import { Query } from './types/Query'

const reduceResponses = (responses: JsonValue[], names: string[]) =>
    responses.reduce<JsonMap>((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

export class DataEngine {
    public constructor(
        private link: DataEngineLink,
        private cache?: DataEngineCache
    ) {}

    public query(
        query: Query,
        {
            variables = {},
            signal,
            onComplete,
            onError,
            invalidateCache,
        }: QueryExecuteOptions = {}
    ): Promise<JsonMap> {
        const names = Object.keys(query)
        const queries = names
            .map(name => query[name])
            .map(q => resolveDynamicQuery(q, variables))

        validateResourceQueries(queries, names)

        return Promise.all(
            queries.map(q => {
                const cacheKey = this.cache?.createKey(q) || ''

                if (cacheKey && invalidateCache) {
                    this.cache?.invalidateCacheByKey(cacheKey)
                }

                if (cacheKey && !this.cache?.keyExists(cacheKey)) {
                    const fn = () =>
                        this.link.executeResourceQuery('read', q, {
                            signal,
                        })

                    return this.cache?.registerResource(cacheKey, fn)()
                }

                return (
                    this.cache?.getCacheByKey(cacheKey) ||
                    this.link.executeResourceQuery('read', q, {
                        signal,
                    })
                )
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

        const type = getMutationFetchType(mutation)
        validateResourceQuery(type, query)

        const result = this.link.executeResourceQuery(type, query, {
            signal,
        })
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
