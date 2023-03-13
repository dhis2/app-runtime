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
    // syntax needed to appease typescript
    ;(console.error as jest.Mock).mockRestore()
})

describe('Testing offline provider', () => {
    it('Should render without failing', () => {
        render(
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                <div data-testid="test-div" />
            </OfflineProvider>
        )

        expect(screen.getByTestId('test-div')).toBeInTheDocument()
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
            <OfflineProvider offlineInterface={testOfflineInterface}>
                <CachedSections />
            </OfflineProvider>
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
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                <TestConsumer />
            </OfflineProvider>
        )

        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })

    it('Should render without failing when no offlineInterface is provided', () => {
        render(
            <OfflineProvider>
                <div data-testid="test-div" />
            </OfflineProvider>
        )
        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })

    it('Should render without failing if PWA is not enabled', () => {
        const testOfflineInterface = {
            ...mockOfflineInterface,
            pwaEnabled: false,
        }
        render(
            <OfflineProvider offlineInterface={testOfflineInterface}>
                <div data-testid="test-div" />
            </OfflineProvider>
        )

        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })
})
