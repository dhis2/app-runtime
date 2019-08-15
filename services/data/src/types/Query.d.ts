import { FetchError } from './FetchError'

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

export interface QueryDefinition extends QueryParameters {
    resource: string
}

export type QueryMap = Record<string, QueryDefinition>

export type RefetchCallback = () => void

export interface QueryState {
    loading: boolean
    error?: FetchError
    data?: any
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
