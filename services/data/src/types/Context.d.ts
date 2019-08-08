import { QueryDefinition } from './Query'

export type FetchFunction = (
    query: QueryDefinition,
    options?: RequestInit
) => Promise<any>

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
