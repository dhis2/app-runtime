/* eslint-disable react/prop-types */

import { Provider, DataProvider } from '@dhis2/app-runtime'
import React from 'react'

export const SwitchableProvider = ({ type, config, children }) => {
    if (type === 'data') {
        return (
            <DataProvider
                baseUrl={config.baseUrl}
                apiVersion={config.apiVersion}
            >
                {children}
            </DataProvider>
        )
    } else if (type === 'runtime') {
        return <Provider config={config}>{children}</Provider>
    }
    throw new Error(`Invalid provider type ${type}`)
}
