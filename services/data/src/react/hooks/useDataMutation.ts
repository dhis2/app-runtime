import { useState } from 'react'
import { useMutation } from 'react-query'
import { JsonValue, QueryVariables, QueryOptions, Mutation } from '../../engine'
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

    const mutationFn = (variables: QueryVariables): Promise<JsonValue> =>
        engine.mutate(theMutation, { ...initialVariables, ...variables })
    // FIXME: JsonValue and react-query's JsonMap aren't compatible
    const { data, mutate, error, isLoading, isIdle } = useMutation(mutationFn, {
        onSuccess,
        onError,
    })

    if (shouldMutateNow) {
        setShouldMutateNow(false)

        // Not passing variables since they're already present in initialVariables
        mutate({})
    }

    /**
     * react-query returns null or an error, but we return undefined
     * or an error, so this ensures consistency with the other types.
     */
    const ourError = error || undefined

    return [
        // FIXME: the signature of react-query's mutate is slightly different
        mutate,
        { engine, called: !isIdle, loading: isLoading, error: ourError, data },
    ]
}
