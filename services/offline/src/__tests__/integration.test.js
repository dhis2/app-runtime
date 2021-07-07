/* eslint-disable react/prop-types */

import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { useCacheableSection, CacheableSection } from '../lib/cacheable-section'
import { OfflineProvider } from '../lib/offline-provider'

const successfulRecordingMock = jest
    .fn()
    .mockImplementation(async ({ onStarted, onCompleted } = {}) => {
        // in 500ms, call 'onStarted' callback (allows 'pending' state)
        if (onStarted) setTimeout(() => act(onStarted), 500)

        // in 1500ms, call 'onCompleted' callback
        if (onCompleted) setTimeout(() => act(onCompleted), 2000)

        // resolve
        return Promise.resolve()
    })

const errorRecordingMock = jest
    .fn()
    .mockImplementation(({ onStarted, onError } = {}) => {
        // start right away this time - don't need to test pending
        if (onStarted) onStarted()

        // in 1000ms, call 'onError'
        setTimeout(() => onError(new Error('test err')), 1000)

        // resolve to signal successful initiation
        return Promise.resolve()
    })

const failedMessageRecordingMock = jest
    .fn()
    .mockRejectedValue(new Error('Failed message'))

const mockOfflineInterface = {
    init: jest.fn(),
    startRecording: successfulRecordingMock,
    getCachedSections: jest.fn().mockResolvedValue(['TODO: Dummy sections']),
    removeSection: jest.fn().mockResolvedValue(true),
}

const RenderCounter = ({ count, testId }) => (
    <div data-testid={testId}>{++count}</div>
)

const TestControls = ({ id, renderCount }) => {
    const {
        startRecording,
        remove,
        isCached,
        lastUpdated,
        recordingState,
    } = useCacheableSection(id)

    return (
        <>
            <RenderCounter
                count={renderCount}
                testId={`controls-render-count-${id}`}
            />
            <button
                data-testid={`start-recording-${id}`}
                onClick={() => {
                    console.log('todo: start recording')
                    startRecording()
                }}
            />
            <button
                data-testid={`remove-${id}`}
                onClick={() => {
                    console.log('todo: remove')
                    remove()
                }}
            />
            <div data-testid={`is-cached-${id}`}>{isCached ? 'yes' : 'no'}</div>
            <div data-testid={`last-updated-${id}`}>
                {lastUpdated || 'never'}
            </div>
            <div data-testid={`recording-state-${id}`}>{recordingState}</div>
        </>
    )
}

const TestSection = ({ id, renderCount }) => (
    <CacheableSection
        id={id}
        loadingMask={<div data-testid={`loading-mask-${id}`} />}
    >
        <RenderCounter
            count={renderCount}
            testId={`section-render-count-${id}`}
        />
    </CacheableSection>
)

const TestSingleSection = () => {
    let controlsRenderCount = 0,
        sectionRenderCount = 0

    return (
        <OfflineProvider offlineInterface={mockOfflineInterface}>
            <TestControls id={'1'} renderCount={controlsRenderCount} />
            <TestSection id={'1'} renderCount={sectionRenderCount} />
        </OfflineProvider>
    )
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('Testing single section', () => {
    // Wrapper for rendered hooks and sections in tests
    const wrapper = ({ children }) => (
        <OfflineProvider offlineInterface={mockOfflineInterface}>
            {children}
        </OfflineProvider>
    )

    it('renders in the default state initially', () => {
        // Set up hook
        const { result } = renderHook(() => useCacheableSection('one'), {
            wrapper,
        })

        // Set up section
        let sectionRenderCount = 0 // eslint-disable-line prefer-const
        render(<TestSection id="one" renderCount={sectionRenderCount} />, {
            wrapper,
        })

        expect(screen.getByTestId(/section-render-count/).textContent).toBe('1')
        expect(result.current.recordingState).toBe('default')
        expect(result.current.isCached).toBe(false)
        expect(result.current.lastUpdated).toBeUndefined()
    })

    it('handles a successful recording', async done => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCacheableSection('one'),
            {
                wrapper,
            }
        )
        let sectionRenderCount = 0 // eslint-disable-line prefer-const
        render(<TestSection id="one" renderCount={sectionRenderCount} />, {
            wrapper,
        })

        const assertRecordingPending = jest
            .fn()
            .mockImplementation(async () => {
                console.log('pending')
                expect(result.current.recordingState).toBe('pending')

                // While pending, section children should not be rendered
                // expect(screen.getByTestId(/section-render-count/)).not.toBeDefined()
            })
        const assertRecordingStarted = jest
            .fn()
            .mockImplementation(async () => {
                await waitForNextUpdate()

                console.log('starting')
                expect(result.current.recordingState).toBe('recording')

                // await act(async () => await waitForNextUpdate())
                // While recording, section and loading mask should be rendered
                // expect(screen.getByTestId(/section-render-count/))
                // expect(screen.getByTestId(/loading-mask/))
            })
        const assertRecordingCompleted = jest
            .fn()
            .mockImplementation(async () => {
                await waitForNextUpdate()

                console.log('completing')
                expect(result.current.recordingState).toBe('default')

                // When finished, only children should be rendered, not mask
                // expect(screen.getByTestId(/section-render-count/))
                // expect(screen.getByTestId(/loading-mask/)).toThrow()

                // TODO: Assert render count has not increased since recording?
                done()
            })

        await act(async () => {
            result.current
                .startRecording({
                    onStarted: assertRecordingStarted,
                    onCompleted: assertRecordingCompleted,
                })
                .then(assertRecordingPending)
        })

        // TODO: Assert correct params to offlineInterface

        // TODO: Assert assertions were asserted (lol) - may need to happen asynchronously
        // expect(assertRecordingStarted).toBeCalledTimes(1)
        // expect(assertRecordingCompleted).toBeCalledTimes(1)
    })

    it.todo('accepts `recordingTimeoutDelay` option') // may be a unit test

    it.todo('handles a recording that encounters an error')

    it.todo('handles an error starting the recording')
})

// Don't forget screen.debug!

// TODO: Multiple sections
describe('multiple sections', () => {
    it.skip('renders initially in the default state', () => {
        render(<TestSingleSection />)

        expect(screen.getByTestId(/recording-state/).textContent).toBe(
            'default'
        )
        expect(screen.getByTestId(/is-cached/).textContent).toBe('no')
        expect(screen.getByTestId(/last-updated/).textContent).toBe('never')
        expect(screen.getByTestId(/section-render-count/).textContent).toBe('1')
        expect(screen.getByTestId(/controls-render-count/).textContent).toBe(
            '1'
        )
    })
})

// The tests

// TODO: Move to offline-provider.test.js
describe.skip('Testing offline provider', () => {
    it('Should render without failing', async () => {
        render(
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                <div data-testid="test-div" />
            </OfflineProvider>
        )

        expect(screen.findByTestId('test-div')).toBeDefined()
    })

    it('Should initialize the offline interface with an update prompt', () => {
        render(<OfflineProvider offlineInterface={mockOfflineInterface} />)

        expect(mockOfflineInterface.init).toHaveBeenCalledTimes(1)

        // Expect to have been called with a 'promptUpdate' function
        const arg = mockOfflineInterface.init.mock.calls[0][0]
        expect(arg).toHaveProperty('promptUpdate')
        expect(typeof arg['promptUpdate']).toBe('function')
    })

    it('Should provide the relevant contexts to cacheable sections', () => {
        const TestConsumer = () => {
            useCacheableSection('id')

            return (
                <CacheableSection id={'id'}>
                    <div data-testid="test-div" />
                </CacheableSection>
            )
        }

        render(
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                <TestConsumer />
            </OfflineProvider>
        )

        expect(screen.getByTestId('test-div')).toBeDefined()
    })
})

// Can hooks be mocked? Like spy on 'useCachedSection' to see if 'remove' gets
// called

// How will we test the state management?
// Unit test: use the hooks; make sure that different ones don't rerender
// when others' states change

// TODO: Test useCacheableSection
// startRecording:
// - offlineInterface method is called with right options
// - state gets updated
// - Upon finishing, 'update cached sections' is called (integration)

// remove:
// - test that useCachedSection 'remove' is called
// - check if 'update cached sections' is called

// TODO: Integration tests
// call startRecording
// - check if offlineInterface.startRecording is called
// - check if recording state changes to 'pending'
// - check if CacheableSection renders nothing

// mock implementation to trigger 'onRecordingStarted' callback
// - check if recording state changes to 'recording'
// - check if CacheableSection section renders loading mask AND children
// - check if app's 'onStarted' callback is called

// mock implementation to wait, then trigger 'onRecordingCompleted' callback
// - check if recording state changes to 'default'
// - check if Cached Section state is synced/updated
// - check if app's 'onCompleted' callback is called
// could mock 'getCachedSections' to resolve to new value
// - check if that value is used

// test errors by mocking 'onRecordingError' callback w/ error object
// - check if recording state changes to 'error'
// - check if CacheableSection renders children (with rerender!)
// - check if App's 'onError' callback is called with an error
