import { useDataMutation } from '../hooks/useDataMutation'
import { MutationRenderInput, Mutation } from '../types/Mutation'

interface MutationInput {
    mutation: Mutation
    children: (input: MutationRenderInput) => any
}

export const DataMutation = ({ mutation, children }: MutationInput) => {
    const mutationState = useDataMutation(mutation)

    return children(mutationState)
}
