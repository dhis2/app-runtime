import React from 'react'
import { ConfigProvider } from '@dhis2/app-service-config'
import { DataProvider } from '@dhis2/app-service-data'
import { Config } from '@dhis2/app-service-config/build/types/types'

type ProviderInput = {
    config: Config
    children: React.ReactNode
}
export const Provider = ({ config, children }: ProviderInput) => (
    <ConfigProvider config={config}>
        <DataProvider>{children}</DataProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
