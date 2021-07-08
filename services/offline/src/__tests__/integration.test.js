/* eslint-disable react/prop-types */

import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useCacheableSection, CacheableSection } from '../lib/cacheable-section'
import { OfflineProvider } from '../lib/offline-provider'
import {
    errorRecordingMock,
    failedMessageRecordingMock,
    mockOfflineInterface,
    RenderCounter,
} from '../utils/test-utils'

const TestControls = ({ id, renderCount, recordingOptions }) => {
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
                    startRecording(recordingOptions).catch(err =>
                        console.error(err)
                    )
                }}
            />
            <button
                data-testid={`remove-${id}`}
                onClick={() => {
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

// TODO: Render counter isn't working
const TestSingleSection = props => {
    let controlsRenderCount = 0, // eslint-disable-line prefer-const
        sectionRenderCount = 0 // eslint-disable-line prefer-const

    // Props are spread so they can be overwritten
    return (
        <OfflineProvider offlineInterface={mockOfflineInterface} {...props}>
            <TestControls
                id={'1'}
                renderCount={controlsRenderCount}
                {...props}
            />
            <TestSection id={'1'} renderCount={sectionRenderCount} {...props} />
        </OfflineProvider>
    )
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('Coordination between useCacheableSection and CacheableSection', () => {
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
        console.error.mockRestore()
    })

    it('renders in the default state initially', async () => {
        render(<TestSingleSection />)

        const { getByTestId } = screen
        expect(getByTestId(/recording-state/).textContent).toBe('default')
        expect(getByTestId(/is-cached/).textContent).toBe('no')
        expect(getByTestId(/last-updated/).textContent).toBe('never')
        expect(getByTestId(/section-render-count/).textContent).toBe('1')
        expect(getByTestId(/controls-render-count/).textContent).toBe('1')
    })

    it('handles a successful recording', async done => {
        const { getByTestId, queryByTestId } = screen

        const onStarted = () => {
            expect(getByTestId(/recording-state/).textContent).toBe('recording')
            expect(getByTestId(/loading-mask/)).toBeInTheDocument()
            expect(getByTestId(/section-render-count/)).toBeInTheDocument()
        }
        const onCompleted = () => {
            expect(getByTestId(/recording-state/).textContent).toBe('default')
            expect(queryByTestId(/loading-mask/)).not.toBeInTheDocument()
            done()
        }
        const recordingOptions = { onStarted, onCompleted }
        render(<TestSingleSection recordingOptions={recordingOptions} />)

        await act(async () => {
            fireEvent.click(getByTestId(/start-recording/))
        })

        // At this stage, should be pending
        expect(getByTestId(/recording-state/).textContent).toBe('pending')
        expect(queryByTestId(/section-render-count/)).not.toBeInTheDocument()
        expect.assertions(7)
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
        const { getByTestId, queryByTestId } = screen

        const testOfflineInterface = {
            ...mockOfflineInterface,
            startRecording: errorRecordingMock,
        }

        const onError = () => {
            expect(getByTestId(/recording-state/).textContent).toBe('error')
            expect(queryByTestId(/loading-mask/)).not.toBeInTheDocument()
            expect(getByTestId(/section-render-count/)).toBeInTheDocument()
            done()
        }
        const recordingOptions = { onError }
        render(
            <TestSingleSection
                offlineInterface={testOfflineInterface}
                recordingOptions={recordingOptions}
            />
        )

        await act(async () => {
            fireEvent.click(getByTestId(/start-recording/))
        })

        expect.assertions(3)
    })

    it.skip('handles an error starting the recording', async done => {
        const { getByTestId, queryByTestId } = screen
        const testOfflineInterface = {
            ...mockOfflineInterface,
            startRecording: failedMessageRecordingMock,
        }

        render(<TestSingleSection offlineInterface={testOfflineInterface} />)

        await act(async () => {
            try {
                await fireEvent.click(getByTestId(/start-recording/))
            } catch (err) {
                console.log(err)
            }
        })
    })
})

// TODO: Multiple sections - test that other sections don't rerender when
// another section does
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
// TODO: Test 'getCachedSections' is called on mount
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
