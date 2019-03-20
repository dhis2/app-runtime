import React from 'react'
import { fetchData } from './fetchData'
import { joinPath } from './utils'

type FetchFunction = (
    resourcePath: string,
    options?: RequestInit
) => Promise<Object>
export type DataContextType = {
    baseUrl: string
    apiVersion: number
    apiUrl: string
    fetch: FetchFunction
}
export interface DataContextInput {
    baseUrl: string
    apiVersion: number
}

const uninitializedFetch: FetchFunction = path => {
    throw new Error(
        'DHIS2 data context is must be initialized, please ensure that you include a <DataProvider> in your application'
    )
}
const defaultContext: DataContextType = {
    baseUrl: '',
    apiVersion: 0,
    apiUrl: '',
    fetch: uninitializedFetch,
}

export const makeContext = ({
    baseUrl,
    apiVersion,
}: DataContextInput): DataContextType => {
    const apiUrl = joinPath(baseUrl, 'api', String(apiVersion))
    return {
        baseUrl,
        apiVersion,
        apiUrl,
        fetch: (resourcePath, options) =>
            fetchData(joinPath(apiUrl, resourcePath), options),
    }
}
export const DataContext = React.createContext<DataContextType>(defaultContext)
