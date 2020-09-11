import { useDataEngine } from '@dhis2/app-runtime'
import { useState } from 'react'

const stringify = obj => JSON.stringify(obj, undefined, 2)

export const useExecuteQuery = () => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)

    const execute = ({ query, type }) => {
        setLoading(true)

        const promise =
            type === 'query' ? engine.query(query) : engine.mutate(query)

        return promise
            .then(result => {
                setLoading(false)
                return stringify(result)
            })
            .catch(error => {
                setLoading(false)
                return `ERROR: ${error.message}\n${stringify(error.details)}`
            })
    }

    return { loading, execute }
}
