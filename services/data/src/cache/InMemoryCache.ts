import memoize, { Memoized } from 'memoizee'
import { DataEngineCache } from '../engine/types/DataEngineCache'
import { ResolvedResourceQuery } from '../engine/types/Query'
import { ExecuteFunction } from '../types'

// eslint-disable-next-line @typescript-eslint/ban-types
interface RegisteredResources {
    [key: string]: any
}

export class InMemoryCache implements DataEngineCache {
    private registeredResources: RegisteredResources = {}

    private hash(str: string): string {
        let hash = 0

        if (str.length == 0) return ``

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash // Convert to 32bit integer
        }

        return hash.toString()
    }

    createKey(query: ResolvedResourceQuery): string {
        return this.hash(JSON.stringify(query))
    }

    keyExists(key: string): boolean {
        return this.registeredResources[key] instanceof Function
    }

    getCacheByKey(key: string): any {
        if (!this.keyExists(key)) {
            throw new Error('@TODO')
        }

        return this.registeredResources[key]()
    }

    invalidateCacheByKey(key: string): void {
        if (!this.keyExists(key)) {
            throw new Error('@TODO')
        }

        this.registeredResources[key].clear()
        delete this.registeredResources[key]
    }

    registerResource<ReturnType>(
        key: string,
        execute: ExecuteFunction<ReturnType>
    ): () => Promise<ReturnType> {
        this.registeredResources[key] = memoize(execute, {
            primitive: true,
        }) as ExecuteFunction<ReturnType> &
            Memoized<ExecuteFunction<ReturnType>>

        return this.registeredResources[key]
    }
}
