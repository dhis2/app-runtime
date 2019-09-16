import { useDataMutation } from '../hooks/useDataMutation'
import { Mutation, MutationOptions } from '../engine/types/Mutation'
import { MutationRenderInput } from '../types'

interface MutationInput extends MutationOptions {
    mutation: Mutation
    children: (input: MutationRenderInput) => any
}

export const DataMutation = ({
    mutation,
    onComplete,
    onError,
    variables,
    children,
}: MutationInput) => {
    const mutationState = useDataMutation(mutation, {
        onComplete,
        onError,
        variables,
    })

    return children(mutationState)
}
