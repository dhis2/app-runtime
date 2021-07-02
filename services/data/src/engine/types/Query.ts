import { FetchError } from './FetchError'
import { JsonMap, JsonValue } from './JsonValue'
import { QueryParameters } from './QueryParameters'

export type QueryVariables = Record<string, any>
export type DynamicQueryVariables<T, R = T> = (
    input: T,
    resultSet?: JsonValue
) => R

export interface ResourceQuery {
    resource: string
    id?: string | DynamicQueryVariables<QueryVariables, string>
    data?: QueryVariables | DynamicQueryVariables<QueryVariables>
    params?: QueryVariables | DynamicQueryVariables<QueryVariables>
}

export interface ResolvedResourceQuery extends ResourceQuery {
    id?: string
    data?: any
    params?: QueryParameters
}

export type ParallelQuery = Record<string, ResourceQuery>
export type SequentialQuery = Array<ParallelQuery>
export type Query = ParallelQuery | SequentialQuery
export type QueryResult = JsonMap

export interface QueryOptions {
    variables?: QueryVariables
    onComplete?: (data: QueryResult) => void
    onError?: (error: FetchError) => void
    lazy?: boolean
}
