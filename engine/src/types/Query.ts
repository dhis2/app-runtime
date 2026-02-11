import type { FetchError } from '../errors/FetchError'
import type { JsonMap } from './JsonValue'
import type { PossiblyDynamic } from './PossiblyDynamic'
import type { QueryParameters } from './QueryParameters'

export type QueryVariables = Record<string, any>

export interface ResourceQuery {
    resource: string
    id?: PossiblyDynamic<string, QueryVariables>
    data?: PossiblyDynamic<any, QueryVariables>
    params?: PossiblyDynamic<QueryParameters, QueryVariables>
}

export interface ResolvedResourceQuery extends ResourceQuery {
    id?: string
    data?: any
    params?: QueryParameters
}

export type Query = Record<string, ResourceQuery>
export type QueryResult = JsonMap

export interface QueryOptions<TQueryResult = QueryResult> {
    variables?: QueryVariables
    onComplete?: (data: TQueryResult) => void
    onError?: (error: FetchError) => void
    lazy?: boolean
}
