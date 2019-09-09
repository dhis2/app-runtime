import { ResourceQuery, QueryVariables } from './Query'
import { FetchError } from './FetchError'
import { FetchType } from './ExecuteOptions'

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

export interface MutationOptions {
    variables?: QueryVariables
    onError?: (error: FetchError) => any
    onCompleted?: (data: any) => any
}

export const getFetchType = (mutation: Mutation): FetchType =>
    mutation.type === 'update'
        ? mutation.partial
            ? 'update'
            : 'replace'
        : mutation.type
