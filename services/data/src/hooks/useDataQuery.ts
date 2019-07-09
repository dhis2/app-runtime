import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../components/DataContext'
import { QueryState, QueryMap } from '../types/Query'

export const useDataQuery = (query: QueryMap): QueryState => {
    const names = Object.keys(query)
    const requests = names.map(name => query[name])

    const context = useContext(DataContext)

    const [state, setState] = useState<QueryState>({ loading: true })

    useEffect(() => {
        Promise.all(requests.map(q => context.fetch(q)))
            .then(responses =>
                responses.reduce(
                    (out, response, idx) => ({
                        ...out,
                        [names[idx]]: response,
                    }),
                    []
                )
            )
            .then(data => setState({ loading: false, data }))
            .catch(error => setState({ loading: false, error }))
    }, [])

    return state
}
