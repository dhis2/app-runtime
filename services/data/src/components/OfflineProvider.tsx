import React from 'react'
import {
    makeOfflineContext,
    OfflineContextData,
    OfflineContextOptions,
} from '../context/makeOfflineContext'
import { Context } from './Context'

interface OfflineProviderInput {
    children: React.ReactNode
    data: OfflineContextData
    options?: OfflineContextOptions
}
export const OfflineProvider = ({
    children,
    data,
    options,
}: OfflineProviderInput) => {
    const context = makeOfflineContext(data, options)
    return <Context.Provider value={context}>{children}</Context.Provider>
}
