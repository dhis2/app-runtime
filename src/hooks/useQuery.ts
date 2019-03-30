import { useState, useContext, useEffect } from 'react'
import { Context } from '../components/Context'
import { QueryDefinition, QueryState } from '../types/Query'

export const useQuery = (query: QueryDefinition): QueryState => {
    const context = useContext(Context)

    const [state, setState] = useState<QueryState>({ loading: true })

    useEffect(() => {
        context
            .fetch(query)
            .then(data => setState({ loading: false, data }))
            .catch(error => setState({ loading: false, error }))
    }, [])

    return state
}
