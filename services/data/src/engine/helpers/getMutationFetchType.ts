import { Mutation, FetchType } from '../types'

export const getMutationFetchType = (mutation: Mutation): FetchType =>
    mutation.type === 'update'
        ? mutation.partial
            ? 'update'
            : 'replace'
        : mutation.type
