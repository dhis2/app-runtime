import { QueryState, ResourceQuery, QueryVariables } from './Query'
import { FetchError } from './FetchError'

export type MutationType = 'create' | 'update' | 'delete'
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
    type: 'update'
    id: string
    partial?: boolean
    data: MutationData
}
export interface DeleteMutation extends BaseMutation {
    type: 'delete'
    id: string
}

export type Mutation = CreateMutation | UpdateMutation | DeleteMutation

export type MutationVariables = Record<string, any>
export type DynamicMutation = (variables: MutationVariables) => Mutation

export interface MutationState extends QueryState {
    called: boolean
}
export type MutationFunction = (variables?: MutationVariables) => Promise<any>
export type MutationRenderInput = [MutationFunction, MutationState]

export interface MutationOptions {
    variables?: QueryVariables
    onError?: (error: FetchError) => any
    onCompleted?: (data: any) => any
}
