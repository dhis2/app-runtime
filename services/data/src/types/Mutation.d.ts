import { QueryState, ResourceQuery } from './Query'

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

export type MutationDefinition =
    | CreateMutation
    | UpdateMutation
    | DeleteMutation

export type Mutation = Record<string, MutationDefinition>

export interface MutationState extends QueryState {
    called: boolean
}
export type MutationFunction = () => void
export type MutationRenderInput = [MutationFunction, MutationState]
