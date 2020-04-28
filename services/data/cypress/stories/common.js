import React from 'react'
import { DataProvider } from '@dhis2/app-runtime'

window.apiVersion = 1337
window.baseUrl = 'http://domain.tld'

export const withProvider = (
    apiVersion = window.apiVersion,
    baseUrl = window.baseUrl
) => fn => (
    <DataProvider baseUrl={baseUrl} apiVersion={apiVersion}>
        {fn({ apiVersion })}
    </DataProvider>
)

export const providerDecorator = fn => (
    <DataProvider baseUrl={window.baseUrl} apiVersion={window.apiVersion}>
        {fn()}
    </DataProvider>
)
