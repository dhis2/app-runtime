/* eslint-disable react/display-name, react/prop-types */

import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
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
        const pattern = /Warning: An update to .* inside a test was not wrapped in act/
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

it('renders in the default state initially', () => {
    const { result } = renderHook(() => useCacheableSection('one'), {
        wrapper: ({ children }) => (
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                {children}
            </OfflineProvider>
        ),
    })

    expect(result.current.recordingState).toBe('default')
    expect(result.current.isCached).toBe(false)
    expect(result.current.lastUpdated).toBeUndefined()
})

it('handles a successful recording', async done => {
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
    const { result, waitFor } = renderHook(
        () => useCacheableSection(sectionId),
        {
            wrapper: ({ children }) => (
                <OfflineProvider offlineInterface={testOfflineInterface}>
                    {children}
                </OfflineProvider>
            ),
        }
    )

    const assertRecordingStarted = () => {
        expect(result.current.recordingState).toBe('recording')
    }
    const assertRecordingCompleted = async () => {
        expect(result.current.recordingState).toBe('default')

        // Test that 'isCached' gets updated
        expect(testOfflineInterface.getCachedSections).toBeCalledTimes(2)
        await waitFor(() => result.current.isCached === true)
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

it('handles a recording that encounters an error', async done => {
    // Suppress the expected error from console (in addition to 'act' warning)
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        const actPattern = /Warning: An update to .* inside a test was not wrapped in act/
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
    const { result } = renderHook(() => useCacheableSection('one'), {
        wrapper: ({ children }) => (
            <OfflineProvider offlineInterface={testOfflineInterface}>
                {children}
            </OfflineProvider>
        ),
    })

    const assertRecordingStarted = () => {
        expect(result.current.recordingState).toBe('recording')
    }
    const assertRecordingError = error => {
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

it('handles an error starting the recording', async () => {
    const testOfflineInterface = {
        ...mockOfflineInterface,
        startRecording: failedMessageRecordingMock,
    }
    const { result } = renderHook(() => useCacheableSection('err'), {
        wrapper: ({ children }) => (
            <OfflineProvider offlineInterface={testOfflineInterface}>
                {children}
            </OfflineProvider>
        ),
    })

    await expect(result.current.startRecording()).rejects.toThrow(
        'Failed message' // from failedMessageRecordingMock
    )
})

it('handles remove and updates sections', async () => {
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
    const { result, waitFor } = renderHook(
        () => useCacheableSection(sectionId),
        {
            wrapper: ({ children }) => (
                <OfflineProvider offlineInterface={testOfflineInterface}>
                    {children}
                </OfflineProvider>
            ),
        }
    )

    // Wait for state to sync with indexedDB
    await waitFor(() => result.current.isCached === true)

    let success
    await act(async () => {
        success = await result.current.remove()
    })

    expect(success).toBe(true)
    // Test that 'isCached' gets updated
    expect(testOfflineInterface.getCachedSections).toBeCalledTimes(2)
    await waitFor(() => result.current.isCached === false)
    expect(result.current.isCached).toBe(false)
    expect(result.current.lastUpdated).toBeUndefined()
})
