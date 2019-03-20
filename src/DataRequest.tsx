import React, { useState, useEffect, useContext } from 'react'
import { DataContext, DataContextType } from './DataContext'

interface DataRequestRenderInput {
    loading: boolean
    error: string | undefined
    data: Object | undefined
}
interface DataRequestInput {
    path: string
    children: (input: DataRequestRenderInput) => React.ReactNode
}

export const DataRequest = ({
    path: urlPath,
    children,
}: DataRequestInput): React.ReactNode => {
    const context = useContext(DataContext)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>(undefined)
    const [data, setData] = useState<Object | undefined>(undefined)

    useEffect(() => {
        context
            .fetch(urlPath)
            .then(setData)
            .catch(() => setError(`Failed to fetch ${urlPath}`))
            .then(() => setLoading(false))
    }, [])

    return children({ loading, error, data })
}
