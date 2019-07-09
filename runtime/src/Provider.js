import React from 'react'
import { Provider as ConfigProvider } from '@dhis2/app-service-config'
import { Provider as DataProvider } from '@dhis2/app-service-data'

export const Provider = ({ config, children }) => (
    <ConfigProvider config={config}>
        <DataProvider>{children}</DataProvider>
    </ConfigProvider>
)
