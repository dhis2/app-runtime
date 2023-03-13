import { FetchError } from './FetchError'
import { ResourceQuery, QueryVariables } from './Query'

export type MutationType =
    | 'create'
    | 'update'
    | 'json-patch'
    | 'replace'
    | 'delete'
export interface MutationData {
    [key: string]: any
}
export interface BaseMutation extends ResourceQuery {
    type: MutationType
}
export interface CreateMutation extends BaseMutation {
    type: 'create'
    data: MutationData
}
export interface UpdateMutation extends BaseMutation {
    type: 'update' | 'replace' | 'json-patch'
    id: string
    partial?: boolean
    data: MutationData
}
export interface DeleteMutation extends BaseMutation {
    type: 'delete'
    id: string
}

export type Mutation = CreateMutation | UpdateMutation | DeleteMutation

export interface MutationOptions {
    variables?: QueryVariables
    onError?: (error: FetchError) => any
    onComplete?: (data: any) => any
}
