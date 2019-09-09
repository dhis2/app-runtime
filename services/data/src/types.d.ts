import DataEngine from './engine/DataEngine'
import { QueryVariables, QueryResult } from './engine/types/Query'
import { JsonValue } from './engine/types/JsonValue'
import { FetchError } from './engine/types/FetchError'
import { QueryExecuteOptions } from './engine/types/ExecuteOptions'

export interface ContextType {
    engine: DataEngine
}

export interface ContextInput {
    baseUrl: string
    apiVersion: number
}

export interface RefetchOptions {
    variables?: QueryVariables
}
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
    onCompleted?: (data: any) => void
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

export interface QueryState {
    loading: boolean
    error?: FetchError
    data?: QueryResult
}

export interface QueryRenderInput extends QueryState {
    refetch: QueryRefetchFunction
}

export interface MutationState {
    called: boolean
    loading: boolean
    error?: FetchError
    data?: JsonValue
}

export type MutationRenderInput = [MutationFunction, MutationState]
