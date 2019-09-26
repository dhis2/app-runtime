import React from 'react'
import { useConfig } from '@dhis2/app-service-config'
import { RestAPILink } from '../../links'
import { DataEngine } from '../../engine'
import { DataContext } from '../context'

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
