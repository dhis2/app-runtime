import { QueryDefinition } from './Query'
import { JsonValue } from './JsonValue'

export type FetchFunction = (
    query: QueryDefinition,
    options?: RequestInit
) => Promise<JsonValue>

export interface ContextType {
    baseUrl: string
    apiVersion: number
    apiUrl: string
    fetch: FetchFunction
}

export interface ContextInput {
    baseUrl: string
    apiVersion: number
}
