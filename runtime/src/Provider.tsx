import { AlertsProvider } from '@dhis2/app-service-alerts'
import { ConfigProvider } from '@dhis2/app-service-config'
import { Config } from '@dhis2/app-service-config/build/types/types'
import { DataProvider } from '@dhis2/app-service-data'
import { OfflineProvider } from '@dhis2/app-service-offline'
import React from 'react'

type ProviderInput = {
    config: Config
    children: React.ReactNode
    offlineInterface?: any // temporary until offline service has types
    plugin: boolean
    parentAlertsAdd: any
    showAlertsInPlugin: boolean
    skipApiVersion: boolean
}
export const Provider = ({
    config,
    children,
    offlineInterface,
    plugin,
    parentAlertsAdd,
    showAlertsInPlugin,
    skipApiVersion,
}: ProviderInput) => (
    <ConfigProvider config={config}>
        <AlertsProvider
            plugin={plugin}
            parentAlertsAdd={parentAlertsAdd}
            showAlertsInPlugin={showAlertsInPlugin}
        >
            <DataProvider skipApiVersion={skipApiVersion}>
                <OfflineProvider offlineInterface={offlineInterface}>
                    {children}
                </OfflineProvider>
            </DataProvider>
        </AlertsProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
