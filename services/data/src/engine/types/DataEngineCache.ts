import { ExecuteFunction } from '../../types'
import { ResolvedResourceQuery } from './Query'

export interface DataEngineCache {
    // helpers
    createKey: (query: ResolvedResourceQuery) => string

    // cache retrieval
    keyExists: (key: string) => boolean
    getCacheByKey: (key: string) => any

    // cache manipulation
    invalidateCacheByKey: (key: string) => void
    registerResource: <ReturnType>(
        key: string,
        execute: ExecuteFunction<ReturnType>
    ) => () => Promise<ReturnType>
}
