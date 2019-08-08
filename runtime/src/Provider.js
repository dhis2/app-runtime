import React from 'react'
import { ConfigProvider } from '@dhis2/app-service-config'
import { DataProvider } from '@dhis2/app-service-data'

export const Provider = ({ config, children }) => (
    <ConfigProvider config={config}>
        <DataProvider>{children}</DataProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
