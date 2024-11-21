import { renderHook, act, waitFor } from '@testing-library/react'
import React, { FC, PropsWithChildren } from 'react'
import {
    errorRecordingMock,
    failedMessageRecordingMock,
    mockOfflineInterface,
} from '../../utils/test-mocks'
import { useCacheableSection } from '../cacheable-section'
import { OfflineProvider } from '../offline-provider'

// Suppress 'act' warning for these tests
const originalError = console.error
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        const pattern =
            /Warning: An update to .* inside a test was not wrapped in act/
        if (typeof args[0] === 'string' && pattern.test(args[0])) {
            return
        }
        return originalError.call(console, ...args)
    })
})

afterEach(() => {
    jest.clearAllMocks()
    // This syntax appeases typescript:
    ;(console.error as jest.Mock).mockRestore()
})

it.skip('renders in the default state initially', () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <OfflineProvider offlineInterface={mockOfflineInterface}>
            {children}
        </OfflineProvider>
    )

    const { result } = renderHook(() => useCacheableSection('one'), { wrapper })

    expect(result.current.recordingState).toBe('default')
    expect(result.current.isCached).toBe(false)
    expect(result.current.lastUpdated).toBeUndefined()
})

it('has stable references', () => {
    const wrapper: FC = ({ children }) => (
        <OfflineProvider offlineInterface={mockOfflineInterface}>
            {children}
        </OfflineProvider>
    )
    const { result, rerender } = renderHook(() => useCacheableSection('one'), {
        wrapper,
    })

    const origRecordingState = result.current.recordingState
    const origStartRecording = result.current.startRecording
    const origLastUpdated = result.current.lastUpdated
    const origIsCached = result.current.isCached
    const origRemove = result.current.remove

    rerender()

    expect(result.current.recordingState).toBe(origRecordingState)
    expect(result.current.startRecording).toBe(origStartRecording)
    expect(result.current.lastUpdated).toBe(origLastUpdated)
    expect(result.current.isCached).toBe(origIsCached)
    expect(result.current.remove).toBe(origRemove)
})

it.skip('handles a successful recording', async (done) => {
    const [sectionId, timeoutDelay] = ['one', 1234]
    const testOfflineInterface = {
        ...mockOfflineInterface,
        getCachedSections: jest
            .fn()
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                { sectionId: sectionId, lastUpdated: new Date() },
            ]),
    }
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <OfflineProvider offlineInterface={testOfflineInterface}>
            {children}
        </OfflineProvider>
    )
    const { result } = renderHook(() => useCacheableSection(sectionId), {
        wrapper,
    })

    const assertRecordingStarted = () => {
        expect(result.current.recordingState).toBe('recording')
    }
    const assertRecordingCompleted = async () => {
        expect(result.current.recordingState).toBe('default')

        // Test that 'isCached' gets updated
        expect(testOfflineInterface.getCachedSections).toBeCalledTimes(2)
        await waitFor(() => expect(result.current.isCached).toBe(true))
        expect(result.current.isCached).toBe(true)
        expect(result.current.lastUpdated).toBeInstanceOf(Date)

        // If this cb is not called, test should time out and fail
        done()
    }

    await act(async () => {
        await result.current.startRecording({
            onStarted: assertRecordingStarted,
            onCompleted: assertRecordingCompleted,
            recordingTimeoutDelay: timeoutDelay,
        })
    })

    // At this stage, recording should be 'pending'
    expect(result.current.recordingState).toBe('pending')

    // Check correct options sent to offline interface
    const options = mockOfflineInterface.startRecording.mock.calls[0][0]
    expect(options.sectionId).toBe(sectionId)
    expect(options.recordingTimeoutDelay).toBe(timeoutDelay)
    expect(typeof options.onStarted).toBe('function')
    expect(typeof options.onCompleted).toBe('function')
    expect(typeof options.onError).toBe('function')

    // Make sure all async assertions are called
    expect.assertions(11)
})

it.skip('handles a recording that encounters an error', async (done) => {
    // Suppress the expected error from console (in addition to 'act' warning)
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        const actPattern =
            /Warning: An update to .* inside a test was not wrapped in act/
        const errPattern = /Error during recording/
        const matchesPattern =
            actPattern.test(args[0]) || errPattern.test(args[0])
        if (typeof args[0] === 'string' && matchesPattern) {
            return
        }
        return originalError.call(console, ...args)
    })
    const testOfflineInterface = {
        ...mockOfflineInterface,
        startRecording: errorRecordingMock,
    }
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <OfflineProvider offlineInterface={testOfflineInterface}>
            {children}
        </OfflineProvider>
    )
    const { result } = renderHook(() => useCacheableSection('one'), { wrapper })

    const assertRecordingStarted = () => {
        expect(result.current.recordingState).toBe('recording')
    }
    const assertRecordingError = (error: Error) => {
        expect(result.current.recordingState).toBe('error')
        expect(error.message).toMatch(/test err/) // see errorRecordingMock
        expect(console.error).toHaveBeenCalledWith(
            'Error during recording:',
            error
        )

        // Expect only one call, from initialization:
        expect(mockOfflineInterface.getCachedSections).toBeCalledTimes(1)

        // If this cb is not called, test should time out and fail
        done()
    }

    await act(async () => {
        await result.current.startRecording({
            onStarted: assertRecordingStarted,
            onError: assertRecordingError,
        })
    })

    // At this stage, recording should be 'pending'
    expect(result.current.recordingState).toBe('pending')

    // Make sure all async assertions are called
    expect.assertions(6)
})

it.skip('handles an error starting the recording', async () => {
    const testOfflineInterface = {
        ...mockOfflineInterface,
        startRecording: failedMessageRecordingMock,
    }
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <OfflineProvider offlineInterface={testOfflineInterface}>
            {children}
        </OfflineProvider>
    )
    const { result } = renderHook(() => useCacheableSection('err'), { wrapper })

    await expect(result.current.startRecording()).rejects.toThrow(
        'Failed message' // from failedMessageRecordingMock
    )
})

it.skip('handles remove and updates sections', async () => {
    const sectionId = 'one'
    const testOfflineInterface = {
        ...mockOfflineInterface,
        getCachedSections: jest
            .fn()
            .mockResolvedValueOnce([
                { sectionId: sectionId, lastUpdated: new Date() },
            ])
            .mockResolvedValueOnce([]),
    }
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <OfflineProvider offlineInterface={testOfflineInterface}>
            {children}
        </OfflineProvider>
    )
    const { result } = renderHook(() => useCacheableSection(sectionId), {
        wrapper,
    })

    // Wait for state to sync with indexedDB
    await waitFor(() => expect(result.current.isCached).toBe(true))

    let success
    await act(async () => {
        success = await result.current.remove()
    })

    expect(success).toBe(true)
    // Test that 'isCached' gets updated
    expect(testOfflineInterface.getCachedSections).toBeCalledTimes(2)
    await waitFor(() => expect(result.current.isCached).toBe(false))
    expect(result.current.isCached).toBe(false)
    expect(result.current.lastUpdated).toBeUndefined()
})

it.skip('handles a change in ID', async () => {
    const testOfflineInterface = {
        ...mockOfflineInterface,
        getCachedSections: jest
            .fn()
            .mockResolvedValue([
                { sectionId: 'id-one', lastUpdated: new Date() },
            ]),
    }
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <OfflineProvider offlineInterface={testOfflineInterface}>
            {children}
        </OfflineProvider>
    )
    const { result, rerender } = renderHook(
        (id: any) => useCacheableSection(id),
        { wrapper, initialProps: 'id-one' }
    )

    // Wait for state to sync with indexedDB
    await waitFor(() => expect(result.current.isCached).toBe(true))

    rerender('id-two')

    // Test that 'isCached' gets updated
    // expect(testOfflineInterface.getCachedSections).toBeCalledTimes(2)
    await waitFor(() => expect(result.current.isCached).toBe(false))
    expect(result.current.isCached).toBe(false)
    expect(result.current.lastUpdated).toBeUndefined()
})
