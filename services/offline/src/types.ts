export type AnyFunction = (...args: any[]) => void
export type UnsubscribeFunction = () => void

export interface EventHandlerInterface {
    subscribe: (event: string, callback: AnyFunction) => void
    unsubscribe: (event: string, calback: AnyFunction) => void
}

export type CacheableSectionStateUpdate = {
    recordingPending?: boolean
    updating?: boolean
    recording?: boolean
    lastUpdated?: Date
}
export type CacheableSectionState = {
    recordingPending: boolean
    updating: boolean
    recording: boolean
    lastUpdated?: Date
}
export interface CacheableSectionControllerInterface
    extends EventHandlerInterface {
    getState: () => CacheableSectionState

    startRecording: () => Promise<void>
    stopRecording: () => Promise<void>
    update: () => Promise<void>
}

export type CacheableSectionOptions = {
    id: string
}

export type OfflineConfigEvent = 'onlineStatusChange'
export type OfflineCache = {
    startRecording: (id: string) => Promise<void>
    stopRecording: (id: string) => Promise<void>
    update: (id: string) => Promise<void>
    has: (id: string) => boolean
}

export type SectionSubscriptionEvent = 'addSection' | 'removeSection'
export type SubscribableEvent = SectionSubscriptionEvent | OfflineConfigEvent
export interface OfflineConfig {
    cache: OfflineCache
    getIsOnline: () => boolean
    subscribe: (
        event: OfflineConfigEvent,
        callback: AnyFunction
    ) => UnsubscribeFunction
}

export interface OfflineContextType extends OfflineConfig {
    subscribe: (
        event: SubscribableEvent,
        callback: AnyFunction
    ) => UnsubscribeFunction
    addSection: (
        options: CacheableSectionOptions
    ) => CacheableSectionControllerInterface
    removeSection: (id: string) => void
    getSection: (id: string) => CacheableSectionControllerInterface | undefined
}
