import { useConfig } from '@dhis2/app-service-config'
import { DataEngine, RestAPILink } from '@dhis2/data-engine'
import {
    QueryClient,
    QueryClientProvider,
    type QueryClientConfig,
} from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { DataContext } from '../context/DataContext'

export interface ProviderInput {
    baseUrl?: string
    apiVersion?: number
    children: React.ReactNode
}

export const queryClientOptions: QueryClientConfig = {
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
    },
}

const queryClient = new QueryClient(queryClientOptions)

export const DataProvider = ({
    baseUrl,
    apiVersion,
    children,
}: ProviderInput): JSX.Element => {
    const config = useConfig()
    const resolvedConfig = useMemo(() => {
        const newConfig = { ...config }
        if (typeof baseUrl === 'string') {
            newConfig.baseUrl = baseUrl
        }
        if (typeof apiVersion === 'number') {
            newConfig.apiVersion = apiVersion
        }
        return newConfig
    }, [config, baseUrl, apiVersion])
    const context = useMemo(() => {
        const link = new RestAPILink(resolvedConfig)
        const engine = new DataEngine(link)
        return { engine }
    }, [resolvedConfig])

    return (
        <QueryClientProvider client={queryClient}>
            <DataContext.Provider value={context}>
                {children}
            </DataContext.Provider>
        </QueryClientProvider>
    )
}
