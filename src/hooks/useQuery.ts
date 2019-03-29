import { useState, useContext, useEffect } from 'react'
import { Context } from '../components/context'
import { FetchError } from '../types/FetchError'
import { QueryDefinition } from '../types/Query'

export const useQuery = (
    query: QueryDefinition
): [boolean, FetchError | undefined, Object | undefined] => {
    const context = useContext(Context)

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<FetchError | undefined>(undefined)
    const [data, setData] = useState<Object | undefined>(undefined)

    useEffect(() => {
        context
            .fetch(query)
            .then(setData)
            .catch(setError)
            .then(() => setLoading(false))
    }, [])

    return [loading, error, data]
}
