import { FetchError } from './FetchError'
import { JsonMap } from './JsonValue'
import { PossiblyDynamic } from './PossiblyDynamic'
import { QueryParameters } from './QueryParameters'

export type QueryVariables = Record<string, any>

export interface ResourceQuery {
    resource: string
    id?: PossiblyDynamic<string, QueryVariables>
    data?: PossiblyDynamic<any, QueryVariables>
    params?: PossiblyDynamic<QueryParameters, QueryVariables>
}

export interface ResolvedResourceQuery extends ResourceQuery {
    id?: string
    data?: any
    params?: QueryParameters
}

export type Query<TQueryResult extends QueryResult = QueryResult> = Record<
    keyof TQueryResult,
    ResourceQuery
>
export type QueryResult = JsonMap

export type QueryResultData<
    TQuery extends Query<TQueryResultData>,
    TQueryResultData extends QueryResult = QueryResult
> = {
    [K in keyof TQuery]: TQueryResultData
}

export interface QueryOptions {
    variables?: QueryVariables
    onComplete?: (data: QueryResult) => void
    onError?: (error: FetchError) => void
    lazy?: boolean
}
