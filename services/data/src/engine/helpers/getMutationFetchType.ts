import { FetchType } from '../types/ExecuteOptions'
import { Mutation } from '../types/Mutation'

export const getMutationFetchType = (mutation: Mutation): FetchType =>
    mutation.type === 'update'
        ? mutation.partial
            ? 'update'
            : 'replace'
        : mutation.type
