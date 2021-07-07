import { render, screen } from '@testing-library/react'
import React from 'react'
import { useCacheableSection, CacheableSection } from '../lib/cacheable-section'
import { OfflineProvider } from '../lib/offline-provider'

const mockOfflineInterface = {
    init: jest.fn(),
    startRecording: jest.fn().mockResolvedValue(),
    getCachedSections: jest.fn().mockResolvedValue(['TODO: Dummy sections']),
    removeSection: jest.fn().mockResolvedValue(true),
}

const TestComponents = () => (
    <OfflineProvider offlineInterface={mockOfflineInterface}></OfflineProvider>
)

afterEach(() => {
    jest.clearAllMocks()
})

// TODO: Move to offline-provider.test.js
describe('Testing offline provider', () => {
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
