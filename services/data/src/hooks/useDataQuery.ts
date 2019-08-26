import { useState, useContext, useEffect, useCallback } from 'react'
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

    const requestPromises = requests.map(({ headers = {}, ...q }) =>
        context.fetch(q, { headers, signal })
    )

    return Promise.all(requestPromises).then(responses =>
        reduceResponses(responses, names)
    )
}

export const useDataQuery = (query: QueryMap): QueryRenderInput => {
    const context = useContext(DataContext)
    const [state, setState] = useState<QueryState>({ loading: true })
    const [refetchCount, setRefetchCount] = useState(0)
    const refetch: RefetchCallback = useCallback(
        () => setRefetchCount(count => count + 1),
        []
    )

    useEffect(() => {
        const controller = new AbortController()
        const abort = () => controller.abort()

        fetchData(context, query, controller.signal)
            .then(data => {
                !controller.signal.aborted && setState({ loading: false, data })
            })
            .catch(error => {
                !controller.signal.aborted &&
                    setState({ loading: false, error })
            })

        // Cleanup inflight requests
        return abort
    }, [context, refetchCount]) // eslint-disable-line react-hooks/exhaustive-deps

    return { refetch, ...state }
}
