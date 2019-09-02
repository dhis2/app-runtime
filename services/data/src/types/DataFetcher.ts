import { PossiblyDynamic } from './PossiblyDynamic'
import { QueryVariables } from './Query'
import { JsonValue } from './JsonValue'
import { FetchError } from './FetchError'

export type FetchType = 'create' | 'read' | 'update' | 'replace' | 'delete'
export interface FetchDetails {
    type: FetchType
    resource: string
    id?: PossiblyDynamic<string, QueryVariables>
    body?: PossiblyDynamic<JsonValue, QueryVariables>
    params: Record<string, any>
}
export interface FetcherInput {
    details: FetchDetails[]
    variables: QueryVariables
    singular: boolean
    immediate: boolean
    transformData?: (data: JsonValue[]) => JsonValue
    onCompleted?: (data: any) => void
    onError?: (error: FetchError) => void
}
export type RefetchFunction = (variables?: QueryVariables) => Promise<JsonValue>

export interface FetcherResult {
    refetch: RefetchFunction
    abort: () => void
    called: boolean
    loading: boolean
    error?: FetchError
    data?: JsonValue[]
}
