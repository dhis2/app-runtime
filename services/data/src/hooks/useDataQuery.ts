import { useState, useContext, useEffect, useCallback } from 'react'
import { DataContext } from '../components/DataContext'
import {
    QueryState,
    Query,
    QueryVariables,
    DynamicQuery,
    RefetchCallback,
    QueryRenderInput,
    QueryOptions,
} from '../types/Query'
import { ContextType } from '../types/Context'

const resolveQuery = (
    q: Query | DynamicQuery,
    variables: QueryVariables
): Query => {
    if (typeof q === 'function') {
        return q(variables)
    }
    return q
}

const reduceResponses = (responses: any[], names: string[]) =>
    responses.reduce((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

interface FetchDataInput {
    context: ContextType
    query: Query | DynamicQuery
    signal: AbortSignal
    variables: QueryVariables
}
const fetchData = ({ context, query, signal, variables }: FetchDataInput) => {
    const resolvedQuery = resolveQuery(query, variables)
    const names = Object.keys(resolvedQuery)
    const requests = names.map(name => resolvedQuery[name])

    const requestPromises = requests.map(q =>
        context.fetch(q, {
            signal: signal,
        })
    )

    return Promise.all(requestPromises).then(responses =>
        reduceResponses(responses, names)
    )
}

export const useDataQuery = (
    query: Query | DynamicQuery,
    {
        onCompleted,
        onError,
        variables: initialVariables = {},
    }: QueryOptions = {}
): QueryRenderInput => {
    const context = useContext(DataContext)
    const [theQuery] = useState(() => query)
    if (query !== theQuery) {
        console.warn(
            "Mutation definitions should be static, don't create the mutation within the render loop!"
        )
    }
    const [state, setState] = useState<QueryState>({ loading: true })
    const [variables, setVariables] = useState<QueryVariables>(initialVariables) // TODO: This causes a superfluous render, which *should* be cheap
    const refetch: RefetchCallback = useCallback(newVariables => {
        setVariables(variables => ({
            ...(newVariables || variables), // Always recreate this object to trigger re-fetch
        }))
        setState({ loading: true })
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        const abort = () => controller.abort()

        fetchData({
            context,
            query: theQuery,
            signal: controller.signal,
            variables,
        })
            .then(data => {
                if (!controller.signal.aborted) {
                    setState({ loading: false, data })
                    onCompleted && onCompleted(data)
                }
            })
            .catch(error => {
                if (!controller.signal.aborted) {
                    setState({ loading: false, error })
                    onError && onError(error)
                }
            })

        // Cleanup inflight requests
        return abort
    }, [context, onCompleted, onError, theQuery, variables])

    return { refetch, ...state } // Should this be useMemo to maintain referential integrity when nothing has changed?
}
