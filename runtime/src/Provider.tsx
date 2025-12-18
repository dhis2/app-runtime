import { AlertsProvider } from '@dhis2/app-service-alerts'
import { ConfigProvider } from '@dhis2/app-service-config'
import { Config } from '@dhis2/app-service-config/build/types/types'
import { DataProvider } from '@dhis2/app-service-data'
import { OfflineProvider } from '@dhis2/app-service-offline'
import { CurrentUser, UserProvider } from '@dhis2/app-service-user'
import React from 'react'

type ProviderInput = {
    config: Config
    userInfo?: CurrentUser
    children: React.ReactNode
    offlineInterface?: any // temporary until offline service has types
    plugin: boolean
    parentAlertsAdd: any
    showAlertsInPlugin: boolean
}
export const Provider = ({
    config,
    userInfo,
    children,
    offlineInterface,
    plugin,
    parentAlertsAdd,
    showAlertsInPlugin,
}: ProviderInput) => (
    <ConfigProvider config={config}>
        <AlertsProvider
            plugin={plugin}
            parentAlertsAdd={parentAlertsAdd}
            showAlertsInPlugin={showAlertsInPlugin}
        >
            <DataProvider>
                <OfflineProvider offlineInterface={offlineInterface}>
                    <UserProvider userInfo={userInfo}>{children}</UserProvider>
                </OfflineProvider>
            </DataProvider>
        </AlertsProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
