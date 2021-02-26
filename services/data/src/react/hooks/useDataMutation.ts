import { useCallback } from 'react'
import { QueryOptions, Mutation } from '../../engine'
import { MutationRenderInput } from '../../types'
import { useDataEngine } from './useDataEngine'
import { useQueryExecutor } from './useQueryExecutor'
import { useStaticInput } from './useStaticInput'

const empty = {}
export const useDataMutation = (
    mutation: Mutation,
    { onComplete, onError, variables = empty, lazy = true }: QueryOptions = {}
): MutationRenderInput => {
    const engine = useDataEngine()
    const [theMutation] = useStaticInput<Mutation>(mutation, {
        warn: true,
        name: 'mutation',
    })
    const execute = useCallback(
        options => engine.mutate(theMutation, options),
        [engine, theMutation]
    )
    const { refetch: mutate, called, loading, error, data } = useQueryExecutor({
        execute,
        variables,
        singular: false,
        immediate: !lazy,
        onComplete,
        onError,
    })

    return [mutate, { engine, called, loading, error, data }]
}
