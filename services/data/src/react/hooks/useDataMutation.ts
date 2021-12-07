import { useState } from 'react'
import { useMutation } from 'react-query'
import { QueryOptions, Mutation } from '../../engine'
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

    const mutationFn = variables =>
        engine.mutate(theMutation, { ...initialVariables, ...variables })
    const { data, mutateAsync, error, isLoading, isIdle } = useMutation(
        mutationFn,
        {
            onSuccess,
            onError,
        }
    )

    if (shouldMutateNow) {
        setShouldMutateNow(false)

        // Not passing variables since they're already present in initialVariables
        mutateAsync({})
    }

    /**
     * react-query returns null or an error, but we return undefined
     * or an error, so this ensures consistency with the other types.
     */
    const ourError = error || undefined

    return [
        mutateAsync,
        { engine, called: !isIdle, loading: isLoading, error: ourError, data },
    ]
}
