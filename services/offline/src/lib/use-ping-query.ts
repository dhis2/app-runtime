import { useDataEngine } from '@dhis2/app-service-data'
import { useCallback } from 'react'

// This function has a separate file for easier mocking

const pingQuery = { ping: { resource: 'system/ping' } }

export function usePingQuery(): () => Promise<any> {
    const engine = useDataEngine()

    const ping = useCallback(() => engine.query(pingQuery), [engine])

    return ping
}
