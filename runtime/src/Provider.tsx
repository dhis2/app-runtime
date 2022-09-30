import { AlertsProvider } from '@dhis2/app-service-alerts'
import { ConfigProvider } from '@dhis2/app-service-config'
import { Config } from '@dhis2/app-service-config/build/types/types'
import { ConnectedStatusProvider } from '@dhis2/app-service-connected-status'
import { DataProvider } from '@dhis2/app-service-data'
import { OfflineProvider } from '@dhis2/app-service-offline'
import React from 'react'

type ProviderInput = {
    config: Config
    children: React.ReactNode
    offlineInterface?: any // temporary until offline service has types
}
export const Provider = ({
    config,
    children,
    offlineInterface,
}: ProviderInput) => (
    <ConfigProvider config={config}>
        <AlertsProvider>
            <DataProvider>
                <OfflineProvider offlineInterface={offlineInterface}>
                    <ConnectedStatusProvider>
                        {children}
                    </ConnectedStatusProvider>
                </OfflineProvider>
            </DataProvider>
        </AlertsProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
