/* eslint-disable react/no-unused-prop-types */

import { useConfig } from '@dhis2/app-service-config'
import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query'
import React from 'react'
import { DataEngine } from '../../engine'
import { RestAPILink } from '../../links'
import { DataContext } from '../context/DataContext'

/**
 * Used to silence the default react-query logger. Eventually we
 * could expose the option to consumers
 */
const noop = () => undefined
const customLogger = {
    log: noop,
    warn: noop,
    error: noop,
}

export interface ProviderInput {
    baseUrl?: string
    apiVersion?: number
    children: React.ReactNode
}

export const queryClientOptions: QueryClientConfig = {
    logger: customLogger,
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
            // RQv4 uses 'online' as the default, which pauses queries without network connection.
            // 'always' reestablishes behavior from v3, and lets requests fire when offline
            // https://tanstack.com/query/latest/docs/framework/react/guides/network-mode
            networkMode: 'always',
        },
    }
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
