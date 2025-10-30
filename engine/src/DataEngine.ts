import { getMutationFetchType } from './helpers/getMutationFetchType'
import { resolveDynamicQuery } from './helpers/resolveDynamicQuery'
import {
    validateResourceQuery,
    validateResourceQueries,
} from './helpers/validate'
import { requestOptionsToFetchType } from './links/RestAPILink/queryToRequestOptions'
import type { DataEngineLink } from './types/DataEngineLink'
import type { QueryExecuteOptions } from './types/ExecuteOptions'
import type { JsonMap, JsonValue } from './types/JsonValue'
import type { Mutation } from './types/Mutation'
import type { Query, ResourceQuery } from './types/Query'

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

    public async fetch(
        path: string,
        init: RequestInit = {},
        executeOptions?: QueryExecuteOptions
    ): Promise<unknown> {
        const type = requestOptionsToFetchType(init)

        if (path.indexOf('://') !== -1) {
            throw new Error(
                'Absolute URLs are not supported by the DHIS2 DataEngine fetch interface'
            )
        }
        const uri = new URL(path, 'http://dummybaseurl')
        const [, resource, id] =
            uri.pathname.match(/^\/([^/]+)(?:\/([^?]*))?/) || []

        const params = Object.fromEntries(uri.searchParams)

        if (type === 'read') {
            const queryResult = await this.query(
                {
                    result: {
                        resource,
                        id,
                        params,
                    } as ResourceQuery,
                },
                executeOptions
            )
            return queryResult.result
        }
        return this.mutate(
            {
                type,
                resource,
                id,
                params,
                partial: type === 'update' && init.method === 'PATCH',
                data: init.body?.valueOf(), // TODO: should we parse stringified JSON here?
            } as Mutation,
            executeOptions
        )
    }

    public get(path: string, executeOptions?: QueryExecuteOptions) {
        return this.fetch(path, { method: 'GET' }, executeOptions)
    }
    public post(path: string, body: any, executeOptions?: QueryExecuteOptions) {
        return this.fetch(path, { method: 'POST', body }, executeOptions)
    }
    public put(path: string, body: any, executeOptions?: QueryExecuteOptions) {
        return this.fetch(path, { method: 'PUT', body }, executeOptions)
    }
    public patch(
        path: string,
        body: any,
        executeOptions?: QueryExecuteOptions
    ) {
        return this.fetch(path, { method: 'PATCH', body }, executeOptions)
    }
    public jsonPatch(
        path: string,
        patches: Array<any>,
        executeOptions?: QueryExecuteOptions
    ) {
        return this.fetch(
            path,
            {
                method: 'PATCH',
                body: patches as any,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            executeOptions
        )
    }
    public delete(path: string, executeOptions?: QueryExecuteOptions) {
        return this.fetch(path, { method: 'DELETE' }, executeOptions)
    }
}

export default DataEngine
