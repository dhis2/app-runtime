import React from 'react'
import {
    makeMockContext,
    MockContextData,
    MockContextOptions,
} from '../context/makeMockContext'
import { Context } from './Context'

interface MockProviderInput {
    children: React.ReactNode
    mockData: MockContextData
    options?: MockContextOptions
}
export const MockProvider = ({
    children,
    mockData,
    options,
}: MockProviderInput) => {
    const context = makeMockContext(mockData, options)
    return <Context.Provider value={context}>{children}</Context.Provider>
}
