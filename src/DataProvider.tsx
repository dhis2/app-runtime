import React from 'react'
import { DataContext, makeContext } from './DataContext'

export interface DataProviderInput {
    baseUrl: string
    apiVersion: number
    children: React.ReactNode
}
export const DataProvider = (props: DataProviderInput) => (
    <DataContext.Provider value={makeContext(props)}>
        {props.children}
    </DataContext.Provider>
)
