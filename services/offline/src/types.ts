// Cacheable Section types

export type RecordingState = 'default' | 'pending' | 'error' | 'recording'

// Global state types

export interface GlobalStateMutation {
    (state: any): any
}

export interface GlobalStateStoreMutate {
    (mutation: GlobalStateMutation): void
}

export interface GlobalStateStore {
    getState: () => any
    subscribe: (callback: (state: any) => void) => void
    unsubscribe: (callback: (state: any) => void) => void
    mutate: GlobalStateStoreMutate
}

// Offline Interface types

interface PromptUpdate {
    (params: { message: string; action: string; onConfirm: () => void }): void
}

interface StartRecording {
    (params: {
        sectionId: string
        recordingTimeoutDelay: number
        onStarted: () => void
        onCompleted: () => void
        onError: (err: Error) => void
    }): Promise<undefined>
}

interface IndexedDBCachedSection {
    sectionId: string
    lastUpdated: Date
    // this may change in the future:
    requests: number
}

export interface OfflineInterface {
    readonly pwaEnabled: boolean
    init: (params: { promptUpdate: PromptUpdate }) => () => void
    startRecording: StartRecording
    getCachedSections: () => Promise<IndexedDBCachedSection[]>
    removeSection: (id: string) => Promise<boolean>
}
