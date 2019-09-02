import { QueryOptions } from '../types/Query'
import { useDataFetcher } from './useDataFetcher'
import { Mutation, MutationRenderInput } from '../types/Mutation'
import { useStaticInput } from './useStaticInput'
import { FetchType } from '../types/DataFetcher'

const getFetchType = (mutation: Mutation): FetchType =>
    mutation.type === 'update'
        ? mutation.partial
            ? 'update'
            : 'replace'
        : mutation.type

const empty = {}
export const useDataMutation = (
    mutation: Mutation,
    { onCompleted, onError, variables = empty }: QueryOptions = {}
): MutationRenderInput => {
    const [theMutation] = useStaticInput<Mutation>(mutation, 'mutations')
    const { refetch: mutate, called, loading, error, data } = useDataFetcher({
        details: [
            {
                type: getFetchType(theMutation),
                id: theMutation.type !== 'create' ? theMutation.id : undefined,
                resource: theMutation.resource,
                body:
                    theMutation.type !== 'delete'
                        ? theMutation.data
                        : undefined,
                params: {},
            },
        ],
        variables,
        singular: false,
        immediate: false,
        transformData: data => data[0],
        onCompleted,
        onError,
    })

    return [mutate, { called, loading, error, data }]
}
