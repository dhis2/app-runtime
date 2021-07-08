import { useConfig } from '@dhis2/app-service-config'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DataEngine } from '../../engine'
import { RestAPILink } from '../../links'
import { DataContext } from '../context/DataContext'

export interface ProviderInput {
    baseUrl?: string
    apiVersion?: number
    children: React.ReactNode
}

const queryClient = new QueryClient()

export const DataProvider = (props: ProviderInput) => {
    const config = {
        ...useConfig(),
        ...props,
    }

    const link = new RestAPILink(config)
    const engine = new DataEngine(link)
    const context = { engine }

    return (
        <QueryClientProvider client={queryClient} contextSharing>
            <DataContext.Provider value={context}>
                {props.children}
            </DataContext.Provider>
        </QueryClientProvider>
    )
}
