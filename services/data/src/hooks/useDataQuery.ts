import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../components/DataContext'
import { QueryState, QueryMap } from '../types/Query'
import { ContextType } from '../types/Context'

const reduceRepsonses = (responses: any[], names: string[]) =>
    responses.reduce(
        (out, response, idx) => ({
            ...out,
            [names[idx]]: response,
        }),
        {}
    )

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
        reduceRepsonses(responses, names)
    )
}

export const useDataQuery = (query: QueryMap): QueryState => {
    const context = useContext(DataContext)
    const [state, setState] = useState<QueryState>({
        loading: true,
    })

    useEffect(() => {
        const controller = new AbortController()
        const abort = () => controller.abort()

        fetchData(context, query, controller.signal)
            .then(data => setState({ loading: false, data }))
            .catch(error => setState({ loading: false, error }))

        return abort
    }, [context, query])

    return state
}
