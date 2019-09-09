import React from 'react'
import { useConfig } from '@dhis2/app-service-config'
import { DataContext } from '../context/DataContext'
import { RestAPILink } from '../engine/links/RestAPILink'
import { DataEngine } from '../engine'

export interface ProviderInput {
    baseUrl?: string
    apiVersion?: number
    children: React.ReactNode
}
export const DataProvider = (props: ProviderInput) => {
    const config = {
        ...useConfig(),
        ...props,
    }

    const link = new RestAPILink(config)
    const engine = new DataEngine(link)

    const context = { engine }

    return (
        <DataContext.Provider value={context}>
            {props.children}
        </DataContext.Provider>
    )
}
