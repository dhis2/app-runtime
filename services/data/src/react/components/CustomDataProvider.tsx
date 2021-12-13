import React from 'react'
import { setLogger, QueryClient, QueryClientProvider } from 'react-query'
import { DataEngine } from '../../engine'
import { CustomDataLink, CustomData, CustomLinkOptions } from '../../links'
import { DataContext } from '../context/DataContext'
import { queryClientOptions as queryClientDefaults } from './DataProvider'

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

interface CustomProviderInput {
    children: React.ReactNode
    data: CustomData
    options?: CustomLinkOptions
    queryClientOptions?: any
}

export const CustomDataProvider = ({
    children,
    data,
    options,
    queryClientOptions = queryClientDefaults,
}: CustomProviderInput): JSX.Element => {
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
