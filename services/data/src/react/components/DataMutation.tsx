import { Mutation, MutationOptions } from '../../engine'
import { MutationRenderInput } from '../../types'
import { useDataMutation } from '../hooks/useDataMutation'

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
