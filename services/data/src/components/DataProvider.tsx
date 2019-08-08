import React from 'react'
import { useConfig } from '@dhis2/app-service-config'
import { DataContext } from './DataContext'
import { makeContext } from '../context/makeContext'

export interface ProviderInput {
    baseUrl: string
    apiVersion: number
    children: React.ReactNode
}
export const DataProvider = (props: ProviderInput) => {
    const config = {
        ...useConfig(),
        props,
    }

    return (
        <DataContext.Provider value={makeContext(config)}>
            {props.children}
        </DataContext.Provider>
    )
}
