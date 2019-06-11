import React from 'react'
import { Provider as ConfigProvider } from '@dhis2/app-service-config'
import { Provider as DataProvider } from '@dhis2/app-service-data'
import { CurriedProviders } from './utils/CurriedProviders'

const serviceProviders = [DataProvider]

export const Provider = ({ config, children }) => (
    <ConfigProvider config={config}>
        <CurriedProviders providers={serviceProviders}>
            {children}
        </CurriedProviders>
    </ConfigProvider>
)
