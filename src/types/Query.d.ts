import { FetchError } from './FetchError'

export type QueryParameterSingularValue = string | number
export type QueryParameterAliasedValue = {
    [name: string]: QueryParameterSingularValue
}
export type QueryParameterMultipleValue = Array<
    QueryParameterSingularValue | QueryParameterAliasedValue
>
export type QueryParameterValue =
    | QueryParameterSingularValue
    | QueryParameterAliasedValue
    | QueryParameterMultipleValue
    | undefined

export interface QueryParameters {
    pageSize?: number
    [key: string]: QueryParameterValue
}

export interface QueryDefinition extends QueryParameters {
    resource: string
}

export type QueryMap = {
    [key: string]: QueryDefinition
}

export type QueryState = {
    loading: boolean
    error?: FetchError
    data?: any
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

export type QueryRenderInput = QueryState

export type QueryResult = any
