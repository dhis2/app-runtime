import { useState, useContext, useEffect, useCallback, useRef } from 'react'
import { DataContext } from '../components/DataContext'
import {
    QueryState,
    QueryMap,
    RefetchCallback,
    QueryRenderInput,
} from '../types/Query'
import { ContextType } from '../types/Context'

const reduceResponses = (responses: any[], names: string[]) =>
    responses.reduce((out, response, idx) => {
        out[names[idx]] = response
        return out
    }, {})

const fetchData = (
    context: ContextType,
    query: QueryMap,
    signal: AbortSignal
) => {
    const names = Object.keys(query)
    const requests = names.map(name => query[name])

    const requestPromises = requests.map(q =>
        context.fetch(q, {
            signal: signal,
        })
    )

    return Promise.all(requestPromises).then(responses =>
        reduceResponses(responses, names)
    )
}

export const useDataQuery = (initialQuery: QueryMap): QueryRenderInput => {
    const context = useContext(DataContext)
    const query = useRef<QueryMap>(initialQuery)
    const [state, setState] = useState<QueryState>({ loading: true })
    const [refetchCount, setRefetchCount] = useState(0)
    const refetch: RefetchCallback = useCallback(
        (newQuery: QueryMap | undefined) => {
            if (newQuery) query.current = newQuery
            setRefetchCount(count => count + 1)
        },
        []
    )

    useEffect(() => {
        const controller = new AbortController()
        const abort = () => controller.abort()

        fetchData(context, query.current, controller.signal)
            .then(data => {
                !controller.signal.aborted && setState({ loading: false, data })
            })
            .catch(error => {
                !controller.signal.aborted &&
                    setState({ loading: false, error })
            })

        // Cleanup inflight requests
        return abort
    }, [context, query, refetchCount])

    return { refetch, ...state }
}
