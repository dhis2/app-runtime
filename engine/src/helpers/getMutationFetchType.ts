import { FetchType } from '../types/ExecuteOptions'
import { Mutation } from '../types/Mutation'

export const getMutationFetchType = (mutation: Mutation): FetchType => {
    if ( mutation.type === 'update') {
        return mutation.partial ? 'update' : 'replace'
    }
    return mutation.type
}