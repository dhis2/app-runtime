import { AlertsProvider } from '@dhis2/app-service-alerts'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { mockOfflineInterface } from '../../utils/test-mocks'
import { useCacheableSection, CacheableSection } from '../cacheable-section'
import { useCachedSections } from '../cacheable-section-state'
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
    // syntax needed to appease typescript
    ;(console.error as jest.Mock).mockRestore()
})

describe('Testing offline provider', () => {
    it('Should render without failing', () => {
        render(
            <AlertsProvider>
                <OfflineProvider offlineInterface={mockOfflineInterface}>
                    <div data-testid="test-div" />
                </OfflineProvider>
            </AlertsProvider>
        )

        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })

    it('Should initialize the offline interface with an update prompt', () => {
        render(
            <AlertsProvider>
                <OfflineProvider offlineInterface={mockOfflineInterface} />
            </AlertsProvider>
        )

        expect(mockOfflineInterface.init).toHaveBeenCalledTimes(1)

        // Expect to have been called with a 'promptUpdate' function
        const arg = mockOfflineInterface.init.mock.calls[0][0]
        expect(arg).toHaveProperty('promptUpdate')
        expect(typeof arg['promptUpdate']).toBe('function')
    })

    it('Should sync cached sections with indexedDB', async () => {
        const testOfflineInterface = {
            ...mockOfflineInterface,
            getCachedSections: jest.fn().mockResolvedValue([
                { sectionId: '1', lastUpdated: 'date1' },
                { sectionId: '2', lastUpdated: 'date2' },
            ]),
        }

        const CachedSections = () => {
            const { cachedSections } = useCachedSections()
            return (
                <div data-testid="sections">
                    {JSON.stringify(cachedSections)}
                </div>
            )
        }

        render(
            <AlertsProvider>
                <OfflineProvider offlineInterface={testOfflineInterface}>
                    <CachedSections />
                </OfflineProvider>
            </AlertsProvider>
        )

        const { getByTestId } = screen
        expect(testOfflineInterface.getCachedSections).toHaveBeenCalled()
        await waitFor(() => getByTestId('sections').textContent !== '{}')
        const textContent = JSON.parse(
            getByTestId('sections').textContent || ''
        )
        expect(textContent).toEqual({
            1: { lastUpdated: 'date1' },
            2: { lastUpdated: 'date2' },
        })
    })

    it('Should provide the relevant contexts to consumers', () => {
        const TestConsumer = () => {
            useCacheableSection('id')

            return (
                <CacheableSection loadingMask={<div />} id={'id'}>
                    <div data-testid="test-div" />
                </CacheableSection>
            )
        }

        render(
            <AlertsProvider>
                <OfflineProvider offlineInterface={mockOfflineInterface}>
                    <TestConsumer />
                </OfflineProvider>
            </AlertsProvider>
        )

        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })

    it('Should render without failing when no offlineInterface is provided', () => {
        render(
            <AlertsProvider>
                <OfflineProvider>
                    <div data-testid="test-div" />
                </OfflineProvider>
            </AlertsProvider>
        )
        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })

    it('Should render without failing if PWA is not enabled', () => {
        const testOfflineInterface = {
            ...mockOfflineInterface,
            pwaEnabled: false,
        }
        render(
            <AlertsProvider>
                <OfflineProvider offlineInterface={testOfflineInterface}>
                    <div data-testid="test-div" />
                </OfflineProvider>
            </AlertsProvider>
        )

        // Init should still be called - see comments in offline-provider.js
        expect(testOfflineInterface.init).toHaveBeenCalled()
        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })
})
