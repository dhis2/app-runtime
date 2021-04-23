import React from 'react'
import {
    CacheableSectionOptions,
    OfflineContextType,
    SubscribableEvent,
} from '../types'

const dummyContext = {
    cache: {
        startRecording: async (id: string) => {
            throw new Error(
                `[OfflineCache.startRecording] Not implemented (${id})`
            )
        },
        stopRecording: async (id: string) => {
            throw new Error(
                `[OfflineCache.stopRecording] Not implemented (${id})`
            )
        },
        update: async (id: string) => {
            throw new Error(`[OfflineCache.update] Not implemented (${id})`)
        },
        has: (id: string) => {
            throw new Error(`[OfflineCache.has] Not implemented ${id}`)
        },
    },
    getIsOnline: () => {
        throw new Error(`[OfflineContext.getIsOnline] Not implemented`)
    },
    subscribe: (event: SubscribableEvent) => {
        throw new Error(`[OfflineContext.subscribe] Not implemented (${event})`)
    },
    addSection: (options: CacheableSectionOptions) => {
        throw new Error(
            `[OfflineContext.addSection] Not implemented (${options.id})`
        )
    },
    removeSection: (id: string) => {
        throw new Error(
            `[OfflineContext.removeSection] Not implemented (${id})`
        )
    },
    getSection: (id: string) => {
        throw new Error(`[OfflineContext.getSection] Not implemented ${id}`)
    },
}

export const OfflineContext = React.createContext<OfflineContextType>(
    dummyContext
)
