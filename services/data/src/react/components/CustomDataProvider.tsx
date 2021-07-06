import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DataEngine } from '../../engine'
import { CustomDataLink, CustomData, CustomLinkOptions } from '../../links'
import { DataContext } from '../context/DataContext'

interface CustomProviderInput {
    children: React.ReactNode
    data: CustomData
    options?: CustomLinkOptions
    queryClientOptions?: any
}

/**
 * Disable automatic retries, which can cause tests to take unnecessarily long
 * see: https://react-query.tanstack.com/reference/useQuery
 */
const defaultQueryClientOptions = {
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
}

export const CustomDataProvider = ({
    children,
    data,
    options,
    queryClientOptions = defaultQueryClientOptions,
}: CustomProviderInput) => {
    const link = new CustomDataLink(data, options)
    const engine = new DataEngine(link)
    const queryClient = new QueryClient(queryClientOptions)
    const context = { engine }

    return (
        <QueryClientProvider client={queryClient}>
            <DataContext.Provider value={context}>
                {children}
            </DataContext.Provider>
        </QueryClientProvider>
    )
}
