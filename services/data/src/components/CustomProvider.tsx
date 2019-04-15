import React from 'react'
import {
    makeCustomContext,
    CustomContextData,
    CustomContextOptions,
} from '../context/makeCustomContext'
import { Context } from './Context'

interface CustomProviderInput {
    children: React.ReactNode
    data: CustomContextData
    options?: CustomContextOptions
}
export const CustomProvider = ({
    children,
    data,
    options,
}: CustomProviderInput) => {
    const context = makeCustomContext(data, options)
    return <Context.Provider value={context}>{children}</Context.Provider>
}
