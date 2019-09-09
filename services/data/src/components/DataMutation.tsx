import { useDataMutation } from '../hooks/useDataMutation'
import { Mutation } from '../engine/types/Mutation'
import { MutationRenderInput } from '../types'

interface MutationInput {
    mutation: Mutation
    children: (input: MutationRenderInput) => any
}

export const DataMutation = ({ mutation, children }: MutationInput) => {
    const mutationState = useDataMutation(mutation)

    return children(mutationState)
}
