import DataEngine from './engine/DataEngine'
import { QueryExecuteOptions } from './engine/types/ExecuteOptions'
import { FetchError } from './engine/types/FetchError'
import { JsonValue } from './engine/types/JsonValue'
import { QueryVariables, QueryResult } from './engine/types/Query'

export interface ContextType {
    engine: DataEngine
}

export interface ContextInput {
    baseUrl: string
    apiVersion: number
}

export type RefetchOptions = QueryVariables
export type RefetchFunction<ReturnType> = (
    options?: RefetchOptions
) => Promise<ReturnType>
export type QueryRefetchFunction = RefetchFunction<QueryResult>
export type MutationFunction = RefetchFunction<JsonValue>

export type ExecuteFunction<T> = (options: QueryExecuteOptions) => Promise<T>
export interface ExecuteHookInput<ReturnType> {
    execute: ExecuteFunction<ReturnType>
    variables: QueryVariables
    singular: boolean
    immediate: boolean
    transformData?: (data: JsonValue[]) => JsonValue
    onComplete?: (data: any) => void
    onError?: (error: FetchError) => void
}

export interface ExecuteHookResult<ReturnType> {
    refetch: RefetchFunction<ReturnType>
    abort: () => void
    called: boolean
    loading: boolean
    error?: FetchError
    data?: ReturnType
}

export interface QueryState<TQueryResult> {
    called: boolean
    loading: boolean
    fetching: boolean
    error?: FetchError
    data?: TQueryResult
}

export interface QueryRenderInput<TQueryResult = QueryResult> extends QueryState<TQueryResult> {
    engine: DataEngine
    refetch: QueryRefetchFunction
}

export interface MutationState {
    engine: DataEngine
    called: boolean
    loading: boolean
    error?: FetchError
    data?: JsonValue
}

export type MutationRenderInput = [MutationFunction, MutationState]
