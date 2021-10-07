export const successfulRecordingMock = jest
    .fn()
    .mockImplementation(async ({ onStarted, onCompleted } = {}) => {
        // in 100ms, call 'onStarted' callback (allows 'pending' state)
        if (onStarted) setTimeout(onStarted, 100)

        // in 200ms, call 'onCompleted' callback
        if (onCompleted) setTimeout(onCompleted, 200)

        // resolve
        return Promise.resolve()
    })

export const errorRecordingMock = jest
    .fn()
    .mockImplementation(({ onStarted, onError } = {}) => {
        // in 100ms, call 'onStarted' callback (allows 'pending' state)
        if (onStarted) setTimeout(onStarted, 100)

        // in 200ms, call 'onError'
        setTimeout(() => onError(new Error('test err')), 200)

        // resolve to signal successful initiation
        return Promise.resolve()
    })

export const failedMessageRecordingMock = jest
    .fn()
    .mockRejectedValue(new Error('Failed message'))

export const mockOfflineInterface = {
    pwaEnabled: true,
    startRecording: successfulRecordingMock,
    getCachedSections: jest.fn().mockResolvedValue([]),
    removeSection: jest.fn().mockResolvedValue(true),
}
