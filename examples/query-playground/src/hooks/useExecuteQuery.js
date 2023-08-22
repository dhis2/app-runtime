import { useDataEngine } from '@dhis2/app-runtime'
import { useState } from 'react'

const stringify = (obj) => JSON.stringify(obj, undefined, 2)

export const useExecuteQuery = () => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)

    const execute = async ({ query, type }) => {
        setLoading(true)

        try {
            const result =
                type === 'query'
                    ? await engine.query(query)
                    : await engine.mutate(query)

            setLoading(false)
            return stringify(result)
        } catch (error) {
            setLoading(false)
            return `ERROR: ${error.message}\n${stringify(error.details)}`
        }
    }

    return { loading, execute }
}
