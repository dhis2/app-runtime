import { useConfig } from '@dhis2/app-runtime'
import React from 'react'

export const ConfigConsumer = () => {
    const config = useConfig()
    return (
        <span>
            <strong>Base url:</strong> {config.baseUrl}
            <br />
            <strong>API version:</strong> {config.apiVersion}
        </span>
    )
}
