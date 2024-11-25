/* eslint-disable react/no-unused-prop-types */

import { useConfig } from '@dhis2/app-service-config'
import { DataEngine, RestAPILink } from '@dhis2/data-engine'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DataContext } from '../context/DataContext'

export interface ProviderInput {
    baseUrl?: string
    apiVersion?: number
    children: React.ReactNode
}

export const queryClientOptions = {
    defaultOptions: {
        queries: {
            // Disable automatic error retries
            retry: false,
            // Retry on mount if query has errored
            retryOnMount: true,
            // Refetch on mount if data is stale
            refetchOnMount: true,
            // Don't refetch when the window regains focus
            refetchOnWindowFocus: false,
            // Don't refetch after connection issues
            refetchOnReconnect: false,
        },
    },
}

const queryClient = new QueryClient(queryClientOptions)

export const DataProvider = (props: ProviderInput): JSX.Element => {
    const config = {
        ...useConfig(),
        ...props,
    }

    const link = new RestAPILink(config)
    const engine = new DataEngine(link)
    const context = { engine }

    return (
        <QueryClientProvider client={queryClient}>
            <DataContext.Provider value={context}>
                {props.children}
            </DataContext.Provider>
        </QueryClientProvider>
    )
}
