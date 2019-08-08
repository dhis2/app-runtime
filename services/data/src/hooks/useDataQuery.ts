import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../components/DataContext'
import { QueryState, QueryMap } from '../types/Query'

export const useDataQuery = (query: QueryMap): QueryState => {
    const context = useContext(DataContext)
    const [state, setState] = useState<QueryState>({
        loading: true,
        abort: () => {},
    })

    useEffect(() => {
        const names = Object.keys(query)
        const requests = names.map(name => query[name])

        const controller = new AbortController()
        const abort = () => controller.abort()

        Promise.all(
            requests.map(q =>
                context.fetch(q, {
                    signal: controller.signal,
                })
            )
        )
            .then(responses =>
                responses.reduce(
                    (out, response, idx) => ({
                        ...out,
                        [names[idx]]: response,
                    }),
                    {}
                )
            )
            .then(data => setState({ loading: false, data, abort }))
            .catch(error => setState({ loading: false, error, abort }))

        setState({ loading: true, abort })

        return abort
    }, [context, query])

    return state
}
