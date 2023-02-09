import { AlertsProvider } from '@dhis2/app-service-alerts'
import { ConfigProvider } from '@dhis2/app-service-config'
import { Config } from '@dhis2/app-service-config/build/types/types'
import { DataProvider } from '@dhis2/app-service-data'
import { OfflineProvider } from '@dhis2/app-service-offline'
import { PluginProvider, usePluginContext } from '@dhis2/app-service-plugin'
import React from 'react'

// passed this way to avoid setting plugin service as peer dependency in alerts
const DemoPass = ({
    plugin,
    offlineInterface,
    children,
}: {
    plugin: boolean
    offlineInterface?: any
    children: React.ReactNode
}) => {
    const { parentAlertsAdd, showAlertsInPlugin } = usePluginContext()
    return (
        <AlertsProvider
            plugin={plugin}
            parentAlertsAdd={parentAlertsAdd}
            showAlertsInPlugin={showAlertsInPlugin}
        >
            <DataProvider>
                <OfflineProvider offlineInterface={offlineInterface}>
                    {children}
                </OfflineProvider>
            </DataProvider>
        </AlertsProvider>
    )
}

type ProviderInput = {
    config: Config
    children: React.ReactNode
    offlineInterface?: any // temporary until offline service has types
    plugin: boolean
}
export const Provider = ({
    config,
    children,
    offlineInterface,
    plugin,
}: ProviderInput) => (
    <ConfigProvider config={config}>
        <PluginProvider>
            <DemoPass offlineInterface={offlineInterface} plugin={plugin}>
                {children}
            </DemoPass>
        </PluginProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
