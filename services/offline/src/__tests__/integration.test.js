/* eslint-disable react/prop-types */

import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useCacheableSection, CacheableSection } from '../lib/cacheable-section'
import { OfflineProvider } from '../lib/offline-provider'
import { RenderCounter, resetRenderCounts } from '../utils/render-counter'
import {
    errorRecordingMock,
    failedMessageRecordingMock,
    mockOfflineInterface,
} from '../utils/test-mocks'

// TODO: Test multiple sections and rerendering counts (started below)

const renderCounts = {}

const identity = arg => arg

const TestControls = ({ id, makeRecordingHandler = identity }) => {
    const {
        startRecording,
        remove,
        isCached,
        lastUpdated,
        recordingState,
    } = useCacheableSection(id)

    return (
        <>
            <RenderCounter id={`controls-rc-${id}`} countsObj={renderCounts} />
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

const TestSection = ({ id }) => (
    <CacheableSection
        id={id}
        loadingMask={<div data-testid={`loading-mask-${id}`} />}
    >
        <RenderCounter id={`section-rc-${id}`} countsObj={renderCounts} />
    </CacheableSection>
)

const TestSingleSection = props => {
    // Props are spread so they can be overwritten
    return (
        <OfflineProvider offlineInterface={mockOfflineInterface} {...props}>
            <TestControls id={'1'} {...props} />
            <TestSection id={'1'} {...props} />
        </OfflineProvider>
    )
}

beforeAll(() => {
    // The code in these tests is very asynchronous; exiting on error makes
    // debugging challenging. For this suite, just log errors without exiting
    process.on('unhandledRejection', err => {
        console.error(err)
    })
})

afterEach(() => {
    jest.clearAllMocks()
    resetRenderCounts(renderCounts)
})

afterAll(() => {
    // Go back to previous config
    process.on('unhandledRejection', err => {
        throw err
    })
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
        expect(getByTestId(/recording-state/)).toHaveTextContent('default')
        expect(getByTestId(/is-cached/)).toHaveTextContent('no')
        expect(getByTestId(/last-updated/)).toHaveTextContent('never')
        expect(getByTestId(/section-rc/)).toHaveTextContent('1')
        // TODO: Verify render count
        expect(getByTestId(/controls-rc/)).toBeInTheDocument('1')
    })

    it('handles a successful recording', async done => {
        const { getByTestId, queryByTestId } = screen

        const onStarted = () => {
            expect(getByTestId(/recording-state/)).toHaveTextContent(
                'recording'
            )
            expect(getByTestId(/loading-mask/)).toBeInTheDocument()
            expect(getByTestId(/section-rc/)).toBeInTheDocument()
        }
        const onCompleted = () => {
            expect(getByTestId(/recording-state/)).toHaveTextContent('default')
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
        expect(getByTestId(/recording-state/)).toHaveTextContent('pending')
        expect(queryByTestId(/section-rc/)).not.toBeInTheDocument()
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
            expect(getByTestId(/recording-state/)).toHaveTextContent('error')
            expect(queryByTestId(/loading-mask/)).not.toBeInTheDocument()
            expect(getByTestId(/section-rc/)).toBeInTheDocument()
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
            expect(getByTestId(/recording-state/)).toHaveTextContent('default')
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
describe.skip('multiple sections', () => {
    it('renders initially in the default state', () => {
        render(<TestSingleSection />)

        expect(screen.getByTestId(/recording-state/)).toHaveTextContent(
            'default'
        )
        expect(screen.getByTestId(/is-cached/)).toHaveTextContent('no')
        expect(screen.getByTestId(/last-updated/)).toHaveTextContent('never')
        expect(screen.getByTestId(/section-rc/)).toHaveTextContent('1')
        expect(screen.getByTestId(/controls-rc/)).toHaveTextContent('1')
    })
})
