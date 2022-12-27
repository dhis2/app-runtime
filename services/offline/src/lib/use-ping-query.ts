import { useDataEngine } from '@dhis2/app-service-data'
import { useCallback } from 'react'

// This function has a separate file for easier mocking

const pingQuery = { ping: { resource: 'system/ping' } }

export function usePingQuery(): () => Promise<any> {
    const engine = useDataEngine()

    const ping = useCallback(
        () =>
            engine.query(pingQuery).catch((err) => {
                if (/Unexpected token 'p'/.test(err.message)) {
                    // The request succeeded; this is just a weird endpoint
                    // (rest of the error is '"pong" is not valid JSON')
                    // todo: maybe change link handling of this endpoint
                    return
                } else {
                    // It's a different error; throw to the next catch handler
                    throw err
                }
            }),
        [engine]
    )

    return ping
}
