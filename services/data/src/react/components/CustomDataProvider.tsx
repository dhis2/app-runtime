import React from 'react'
import { DataEngine } from '../../engine'
import { CustomDataLink, CustomData, CustomLinkOptions } from '../../links'
import { DataContext } from '../context/DataContext'

interface CustomProviderInput {
    children: React.ReactNode
    data: CustomData
    options?: CustomLinkOptions
}
export const CustomDataProvider = ({
    children,
    data,
    options,
}: CustomProviderInput) => {
    const link = new CustomDataLink(data, options)
    const engine = new DataEngine(link)

    const context = { engine }
    return (
        <DataContext.Provider value={context}>{children}</DataContext.Provider>
    )
}
