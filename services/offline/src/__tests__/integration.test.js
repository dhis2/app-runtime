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

// TODO: Test multiple sections and rerendering (started below)

const identity = arg => arg

const TestControls = ({ id, renderCount, makeRecordingHandler = identity }) => {
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
                onClick={makeRecordingHandler(startRecording)}
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
        const makeRecordingHandler = startRecording => {
            return () => startRecording(recordingOptions)
        }
        render(
            <TestSingleSection makeRecordingHandler={makeRecordingHandler} />
        )

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
        const makeRecordingHandler = startRecording => {
            return () => startRecording({ onError })
        }
        render(
            <TestSingleSection
                offlineInterface={testOfflineInterface}
                makeRecordingHandler={makeRecordingHandler}
            />
        )

        await act(async () => {
            fireEvent.click(getByTestId(/start-recording/))
        })

        expect.assertions(3)
    })

    it('handles an error starting the recording', async done => {
        const { getByTestId } = screen
        const testOfflineInterface = {
            ...mockOfflineInterface,
            startRecording: failedMessageRecordingMock,
        }

        const onStarted = jest.fn()

        const testErrCondition = err => {
            expect(err.message).toBe('Failed message') // from the mock
            expect(onStarted).not.toHaveBeenCalled()
            expect(getByTestId(/recording-state/).textContent).toBe('default')
            done()
        }

        const makeRecordingHandler = startRecording => {
            return () => startRecording({ onStarted }).catch(testErrCondition)
        }

        render(
            <TestSingleSection
                offlineInterface={testOfflineInterface}
                makeRecordingHandler={makeRecordingHandler}
            />
        )

        await act(async () => {
            fireEvent.click(getByTestId(/start-recording/))
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
