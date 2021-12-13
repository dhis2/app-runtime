import { useConfig } from '@dhis2/app-service-config'
import React from 'react'
import { setLogger, QueryClient, QueryClientProvider } from 'react-query'
import { DataEngine } from '../../engine'
import { RestAPILink } from '../../links'
import { DataContext } from '../context/DataContext'

const noop = () => {
    /**
     * Used to silence the default react-query logger. Eventually we
     * could expose the setLogger functionality and remove the call
     * to setLogger below, or allow users to supply their own loggers.
     */
}

setLogger({
    log: noop,
    warn: noop,
    error: noop,
})

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
