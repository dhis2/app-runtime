import React from 'react'
import { Context } from './Context'
import { makeContext } from '../context/makeContext'

export interface ProviderInput {
    baseUrl: string
    apiVersion: number
    children: React.ReactNode
}
export const Provider = (props: ProviderInput) => (
    <Context.Provider value={makeContext(props)}>
        {props.children}
    </Context.Provider>
)
