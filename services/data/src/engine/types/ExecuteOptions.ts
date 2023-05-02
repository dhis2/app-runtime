import { FetchError } from './FetchError'
import { QueryVariables, QueryResultData, QueryResult } from './Query'

export type FetchType =
    | 'create'
    | 'read'
    | 'update'
    | 'json-patch'
    | 'replace'
    | 'delete'
export interface QueryExecuteOptions<
    TQueryResultData extends QueryResultData = QueryResult
> {
    variables?: QueryVariables
    signal?: AbortSignal
    onComplete?: (data: TQueryResultData) => void
    onError?: (error: FetchError) => void
}
