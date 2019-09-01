import { useContext, useState, useEffect, useCallback, useRef } from 'react'
import { DataContext } from '../components/DataContext'
import {
    MutationState,
    Mutation,
    MutationRenderInput,
    MutationOptions,
    DynamicMutation,
    MutationVariables,
    MutationFunction,
} from '../types/Mutation'
import { ContextType } from '../types/Context'
import { QueryDefinition } from '../types/Query'
import { joinPath } from '../utils/path'

const resolveMutation = (
    m: Mutation | DynamicMutation,
    variables: MutationVariables
): Mutation => {
    if (typeof m === 'function') {
        return m(variables)
    }
    // TODO: Support variables in static mutations
    return m
}
const mutationToQueryDef = (m: Mutation): QueryDefinition => ({
    resource:
        m.type === 'update' || m.type === 'delete'
            ? joinPath(m.resource, m.id)
            : m.resource,
})

const mutationToMethod = (m: Mutation): string => {
    switch (m.type) {
        case 'create':
            return 'POST'
        case 'update':
            if (m.partial) {
                return 'PATCH'
            } else {
                return 'POST'
            }
        case 'delete':
            return 'DELETE'
    }
}

const mutationToPayload = (m: Mutation): string | null => {
    if (m.type === 'delete') {
        return null
    }
    return JSON.stringify(m.data)
}

interface FetchDataInput {
    context: ContextType
    mutation: Mutation | DynamicMutation
    signal: AbortSignal
    variables: MutationVariables
}

const fetchData = ({
    context,
    mutation,
    signal,
    variables = {},
}: FetchDataInput) => {
    const m = resolveMutation(mutation, variables)
    const q = mutationToQueryDef(m)

    return context.fetch(q, {
        method: mutationToMethod(m),
        body: mutationToPayload(m),
        headers: {
            'Content-Type': 'application/json',
        },
        signal: signal,
    })
}

export const useDataMutation = (
    mutation: Mutation,
    {
        onError,
        onCompleted,
        variables: defaultVariables = {},
    }: MutationOptions = {}
): MutationRenderInput => {
    const context = useContext(DataContext)
    const [theMutation] = useState(() => mutation)
    if (mutation !== theMutation) {
        console.warn(
            "Mutation definitions should be static, don't create the mutation within the render loop!"
        )
    }
    const [state, setState] = useState<MutationState>({
        loading: false,
        called: false,
    })

    const controller = useRef<AbortController>()
    const abort = () => {
        controller.current && controller.current.abort()
    }

    const mutate: MutationFunction = useCallback(
        async (variables: MutationVariables = {}) => {
            abort()
            const theController = (controller.current = new AbortController())

            setState({ called: true, loading: true })
            return new Promise<any>(async resolve => {
                try {
                    const data = await fetchData({
                        context,
                        mutation,
                        signal: theController.signal,
                        variables: {
                            ...defaultVariables,
                            ...variables,
                        },
                    })
                    if (!theController.signal.aborted) {
                        setState({ called: true, loading: false, data })
                        if (onCompleted) {
                            onCompleted(data)
                        }
                        resolve(data)
                    }
                } catch (error) {
                    if (!theController.signal.aborted) {
                        setState({ called: true, loading: false, error })
                        if (onError) {
                            onError(error)
                        }
                        // Don't reject the promise - we don't want to unnecessarily bubble up uncaught errors
                    }
                }
            })
        },
        [context, defaultVariables, mutation, onCompleted, onError]
    )

    useEffect(() => {
        // Cleanup inflight request
        return abort
    }, [])

    return [mutate, state]
}
