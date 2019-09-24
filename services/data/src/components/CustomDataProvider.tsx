import React from 'react'
import { CustomData, CustomLinkOptions } from '../engine/links/CustomDataLink'
import { DataContext } from '../context/DataContext'
import { DataEngine } from '../engine'
import { CustomDataLink } from '../engine/links/CustomDataLink'

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
