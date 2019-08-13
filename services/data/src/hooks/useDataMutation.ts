import { MutationState, Mutation, MutationRenderInput } from '../types/Mutation'
import { useContext, useState, useEffect, useCallback, useRef } from 'react'
import { DataContext } from '../components/DataContext'
import { ContextType } from '../types/Context'
import { QueryDefinition } from '../types/Query'
import { joinPath } from '../utils/path'

const mutationToQueryDef = (m: Mutation): QueryDefinition => ({
    resource: joinPath(
        m.resource,
        m.type === 'update' || m.type === 'delete' ? m.id : ''
    ),
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

const fetchData = (
    context: ContextType,
    mutation: Mutation,
    signal: AbortSignal
) => {
    const q = mutationToQueryDef(mutation)

    return context.fetch(q, {
        method: mutationToMethod(mutation),
        body: mutationToPayload(mutation),
        headers: {
            'Content-Type': 'application/json',
        },
        signal: signal,
    })
}

export const useDataMutation = (mutation: Mutation): MutationRenderInput => {
    const context = useContext(DataContext)
    const [state, setState] = useState<MutationState>({
        loading: false,
        called: false,
    })

    const controller = useRef<AbortController>()
    const abort = () => {
        controller.current && controller.current.abort()
    }

    const mutate = useCallback(() => {
        if (controller.current) {
            // Only ever mutate once!
            return
        }
        controller.current = new AbortController()

        setState({ called: true, loading: true })
        fetchData(context, mutation, controller.current.signal)
            .then(data => {
                controller.current &&
                    !controller.current.signal.aborted &&
                    setState({ called: true, loading: false, data })
            })
            .catch(error => {
                controller.current &&
                    !controller.current.signal.aborted &&
                    setState({ called: true, loading: false, error })
            })
    }, [context, mutation]) // Allow these updates before mutation has been initialized

    useEffect(() => {
        // Cleanup inflight requests
        return abort
    }, [])

    return [mutate, state]
}
