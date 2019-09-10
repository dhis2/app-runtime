import { Mutation } from '../types/Mutation'
import { FetchType } from '../types/ExecuteOptions'

export const getMutationFetchType = (mutation: Mutation): FetchType =>
    mutation.type === 'update'
        ? mutation.partial
            ? 'update'
            : 'replace'
        : mutation.type
