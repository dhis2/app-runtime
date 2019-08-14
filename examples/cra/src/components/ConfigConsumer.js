import React from 'react'
import { useConfig } from '@dhis2/app-runtime'

export const ConfigConsumer = () => {
    const config = useConfig()
    return (
        <span>
            <strong>Base url:</strong> {config.baseUrl}
        </span>
    )
}
