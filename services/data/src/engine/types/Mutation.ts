import { FetchError } from './FetchError'
import { ResourceQuery, QueryVariables } from './Query'

export type MutationType = 'create' | 'update' | 'replace' | 'delete'
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
    type: 'update' | 'replace'
    id: string
    partial?: boolean
    data: MutationData
}
export interface DeleteMutation extends BaseMutation {
    type: 'delete'
    id: string
}

export type SingleMutation = CreateMutation | UpdateMutation | DeleteMutation
export type SequentialMutation = Array<Record<string, SingleMutation>>
export type Mutation = SingleMutation | SequentialMutation

export interface MutationOptions {
    variables?: QueryVariables
    onError?: (error: FetchError) => any
    onComplete?: (data: any) => any
}
