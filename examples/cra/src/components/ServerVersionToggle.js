import {
    ServerVersionSwitch,
    ServerVersionCase,
    useDataQuery,
} from '@dhis2/app-runtime'
import { ConfigProvider, useConfig } from '@dhis2/app-service-config'
import React from 'react'

const systemInfoQuery = {
    sysinfo: {
        resource: 'system/info',
    },
}
export const ServerVersionToggle = () => {
    const parentConfig = useConfig()
    const { loading, data } = useDataQuery(systemInfoQuery) // Only necessary because this isn't a platform application
    return (
        <ConfigProvider config={{ ...parentConfig, systemInfo: data?.sysinfo }}>
            <span>Server version:</span>
            {loading && '...'}
            {data && (
                <ServerVersionSwitch>
                    <ServerVersionCase max="2.34">&lt;= 34</ServerVersionCase>
                    <ServerVersionCase min="2.35" max="2.35">
                        35
                    </ServerVersionCase>
                    <ServerVersionCase min="2.36" max="2.36">
                        36
                    </ServerVersionCase>
                    <ServerVersionCase min="2.37" max="2.37">
                        37
                    </ServerVersionCase>
                    <ServerVersionCase min="2.38">&gt;= 38</ServerVersionCase>
                </ServerVersionSwitch>
            )}
        </ConfigProvider>
    )
}
