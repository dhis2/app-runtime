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

export interface QueryState {
    loading: boolean
    error?: FetchError
    data?: Object
}

export type QueryRenderInput = QueryState

export type QueryResult = any
