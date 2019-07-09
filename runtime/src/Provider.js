import React from 'react'
import { ConfigProvider } from '@dhis2/app-service-config'
import { DataProvider } from '@dhis2/app-service-data'

export const DHIS2RuntimeProvider = ({ config, children }) => (
    <ConfigProvider config={config}>
        <DataProvider>{children}</DataProvider>
    </ConfigProvider>
)
