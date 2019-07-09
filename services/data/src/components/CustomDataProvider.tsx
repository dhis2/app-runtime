import React from 'react'
import {
    makeCustomContext,
    CustomContextData,
    CustomContextOptions,
} from '../context/makeCustomContext'
import { DataContext } from './DataContext'

interface CustomProviderInput {
    children: React.ReactNode
    data: CustomContextData
    options?: CustomContextOptions
}
export const CustomDataProvider = ({
    children,
    data,
    options,
}: CustomProviderInput) => {
    const context = makeCustomContext(data, options)
    return (
        <DataContext.Provider value={context}>{children}</DataContext.Provider>
    )
}
