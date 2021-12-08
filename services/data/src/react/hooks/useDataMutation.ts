import { useState } from 'react'
import { useMutation } from 'react-query'
import { QueryVariables, QueryOptions, Mutation } from '../../engine'
import { MutationRenderInput } from '../../types'
import { useDataEngine } from './useDataEngine'
import { useStaticInput } from './useStaticInput'

export const useDataMutation = (
    mutation: Mutation,
    {
        onComplete: onSuccess,
        onError,
        variables: initialVariables = {},
        lazy = true,
    }: QueryOptions = {}
): MutationRenderInput => {
    const engine = useDataEngine()
    const [shouldMutateNow, setShouldMutateNow] = useState(!lazy)
    const [theMutation] = useStaticInput<Mutation>(mutation, {
        warn: true,
        name: 'mutation',
    })

    const mutationFn = (variables: QueryVariables): Promise<any> =>
        engine.mutate(theMutation, { ...initialVariables, ...variables })

    const result = useMutation(mutationFn, {
        onSuccess,
        onError,
    })

    if (shouldMutateNow) {
        setShouldMutateNow(false)

        // Not passing variables since we only have initialVariables at this point
        result.mutate({})
    }

    /**
     * react-query returns null or an error, but we return undefined
     * or an error, so this ensures consistency with the other types.
     */
    const ourError = result.error || undefined

    // This restricts access to react-query's other mutation options
    const ourMutate = (variables: QueryVariables = {}) =>
        result.mutateAsync(variables)

    return [
        ourMutate,
        {
            engine,
            called: !result.isIdle,
            loading: result.isLoading,
            error: ourError,
            data: result.data,
        },
    ]
}
