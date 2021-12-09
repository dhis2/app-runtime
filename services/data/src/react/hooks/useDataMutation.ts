import { useState, useCallback } from 'react'
import { useMutation, setLogger } from 'react-query'
import { QueryVariables, QueryOptions, Mutation } from '../../engine'
import { MutationRenderInput } from '../../types'
import { useDataEngine } from './useDataEngine'
import { useStaticInput } from './useStaticInput'

const noop = () => {
    /**
     * Used to silence the default react-query logger. Eventually we
     * could expose the setLogger functionality and remove the call
     * to setLogger here.
     */
}

setLogger({
    log: noop,
    warn: noop,
    error: noop,
})

export const useDataMutation = (
    mutation: Mutation,
    {
        onComplete: userOnComplete,
        onError: userOnError,
        variables: initialVariables = {},
        lazy = true,
    }: QueryOptions = {}
): MutationRenderInput => {
    const engine = useDataEngine()
    const [variables, setVariables] = useState(initialVariables)
    const [shouldMutateNow, setShouldMutateNow] = useState(!lazy)
    const [theMutation] = useStaticInput<Mutation>(mutation, {
        warn: true,
        name: 'mutation',
    })

    // Ensure we call the supplied onComplete only with the data
    const onSuccess = (data: any) => {
        userOnComplete && userOnComplete(data)
    }
    // Ensure we call the supplied onError only with the error
    const onError = (error: any) => {
        userOnError && userOnError(error)
    }

    const mutationFn = (newVariables: QueryVariables): Promise<any> => {
        const mergedVariables = { ...variables, ...newVariables }

        setVariables(mergedVariables)
        return engine.mutate(theMutation, { variables: mergedVariables })
    }

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
    const { mutateAsync } = result
    const ourMutate = useCallback(
        (variables: QueryVariables = {}) =>
            mutateAsync(variables).catch(() => {
                // Ignore the error
            }),
        [mutateAsync]
    )

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
