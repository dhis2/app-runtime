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
    removeCachedSection: (id: string) => Promise<boolean>
}
