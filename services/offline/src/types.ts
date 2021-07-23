// Cacheable Section types

export type RecordingState = 'default' | 'pending' | 'error' | 'recording'

// Global state types

// This is the mutation that gets executed by store.mutate. Should return
// new state
export interface GlobalStateStoreMutation {
    (state: any): any
}

// Uses generic <Type> because global state mutation will also receive
// the same parameters
export interface GlobalStateStoreMutationCreator<Type> {
    (...args: Type[]): GlobalStateStoreMutation
}

// This is the function returned by useGlobalStateMutation;
// it triggers a GlobalStateStoreMutation
export interface GlobalStateMutation<Type> {
    (...args: Type[]): void
}

export interface GlobalStateStoreMutateMethod {
    (mutation: GlobalStateStoreMutation): void
}

export interface GlobalStateStore {
    getState: () => any
    subscribe: (callback: (state: any) => void) => void
    unsubscribe: (callback: (state: any) => void) => void
    mutate: GlobalStateStoreMutateMethod
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
