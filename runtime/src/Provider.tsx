import { AlertsProvider } from '@dhis2/app-service-alerts'
import { ConfigProvider } from '@dhis2/app-service-config'
import { Config } from '@dhis2/app-service-config/build/types/types'
import { DataProvider } from '@dhis2/app-service-data'
import { LoginSettingsProvider } from '@dhis2/app-service-login-settings'
import { OfflineProvider } from '@dhis2/app-service-offline'
import React from 'react'

type ProviderInput = {
    config: Config
    children: React.ReactNode
    offlineInterface?: any // temporary until offline service has types
    loginApp: boolean
}

export const Provider = ({
    config,
    children,
    offlineInterface,
    loginApp,
}: ProviderInput) => (
    <ConfigProvider config={config}>
        <AlertsProvider>
            <DataProvider>
                <OfflineProvider offlineInterface={offlineInterface}>
                    {loginApp ? (
                        <LoginSettingsProvider>
                            {children}
                        </LoginSettingsProvider>
                    ) : (
                        <>{children}</>
                    )}
                </OfflineProvider>
            </DataProvider>
        </AlertsProvider>
    </ConfigProvider>
)

Provider.displayName = 'DHIS2RuntimeProvider'
