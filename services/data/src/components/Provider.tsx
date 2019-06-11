import React from 'react'
import { useConfig } from '@dhis2/app-service-config'
import { Context } from './Context'
import { makeContext } from '../context/makeContext'

export interface ProviderInput {
    baseUrl: string
    apiVersion: number
    children: React.ReactNode
}
export const Provider = (props: ProviderInput) => {
    const config = {
        ...useConfig(),
        props,
    }

    return (
        <Context.Provider value={makeContext(config)}>
            {props.children}
        </Context.Provider>
    )
}
