import { FetchError } from './FetchError'
import { QueryVariables } from './Query'

export type FetchType = 'create' | 'read' | 'update' | 'replace' | 'delete'
export interface QueryExecuteOptions {
    variables?: QueryVariables
    signal?: AbortSignal
    onCompleted?: (data: any) => void
    onError?: (error: FetchError) => void
}
