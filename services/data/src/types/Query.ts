import { FetchError } from './FetchError'
import { JsonValue } from './JsonValue'

export type QueryParameterSingularValue = string | number
export interface QueryParameterAliasedValue {
    [name: string]: QueryParameterSingularValue
}
export type QueryParameterSingularOrAliasedValue =
    | QueryParameterSingularValue
    | QueryParameterAliasedValue

export type QueryParameterMultipleValue = QueryParameterSingularOrAliasedValue[]

export type QueryParameterValue =
    | QueryParameterSingularValue
    | QueryParameterAliasedValue
    | QueryParameterMultipleValue
    | undefined

export interface QueryParameters {
    pageSize?: number
    [key: string]: QueryParameterValue
}

export interface ResourceQuery {
    resource: string
}
export interface QueryDefinition extends QueryParameters, ResourceQuery {
    // Future
}

export type Query = Record<string, QueryDefinition>

export type QueryVariables = Record<string, any>
export type DynamicQuery = (variables: QueryVariables) => Query

export interface RefetchOptions {
    variables?: QueryVariables
    skipLoadingState?: boolean
}

export type RefetchCallback = (variables?: QueryVariables) => Promise<JsonValue>

export interface QueryState {
    loading: boolean
    error?: FetchError
    data?: JsonValue
}

export interface QueryRenderInput extends QueryState {
    refetch: RefetchCallback
}

/*
// TODO: Use Union type for better static typeguards in consumer
export interface QueryStateLoading {
    loading: true
}
export interface QueryStateError {
    loading: false
    error: FetchError
}
export interface QueryStateData {
    loading: false
    data: any
}
export type QueryState = QueryStateLoading | QueryStateError | QueryStateData
*/

export type QueryResult = any

export interface QueryOptions {
    variables?: QueryVariables
    onCompleted?: (data: QueryResult) => void
    onError?: (error: FetchError) => void
}
