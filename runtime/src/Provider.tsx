import { AlertsProvider } from '@dhis2/app-service-alerts'
import { ConfigProvider } from '@dhis2/app-service-config'
import { Config } from '@dhis2/app-service-config/build/types/types'
import { DataProvider } from '@dhis2/app-service-data'
import React from 'react'

type ProviderInput = {
    config: Config
    children: React.ReactNode
}
export const Provider = ({ config, children }: ProviderInput) => (
    <ConfigProvider config={config}>
        <AlertsProvider>
            <DataProvider>{children}</DataProvider>
        </AlertsProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
