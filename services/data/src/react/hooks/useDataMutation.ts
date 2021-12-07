import { useMutation } from 'react-query'
import { QueryOptions, Mutation } from '../../engine'
import { MutationRenderInput } from '../../types'
import { useDataEngine } from './useDataEngine'
import { useStaticInput } from './useStaticInput'

const empty = {}

export const useDataMutation = (
    mutation: Mutation,
    {
        onComplete,
        onError,
        variables: initialVariables = empty,
        lazy = true,
    }: QueryOptions = {}
): MutationRenderInput => {
    const engine = useDataEngine()
    const [theMutation] = useStaticInput<Mutation>(mutation, {
        warn: true,
        name: 'mutation',
    })

    const mutationFn = variables =>
        engine.mutate(theMutation, { ...initialVariables, ...variables })
    const { data, mutateAsync, error, isLoading, isIdle } = useMutation(
        mutationFn,
        {
            onSuccess: onComplete,
            onError,
        }
    )

    return [
        mutateAsync,
        { engine, called: !isIdle, loading: isLoading, error, data },
    ]
}
