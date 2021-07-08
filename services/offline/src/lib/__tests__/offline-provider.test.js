/* eslint-disable react/prop-types */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockOfflineInterface } from '../../utils/test-utils'
import { useCacheableSection, CacheableSection } from '../cacheable-section'
import { OfflineProvider } from '../offline-provider'

// TODO: Test 'getCachedSections' is called on mount

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
    console.error.mockRestore()
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

        expect(screen.getByTestId('test-div')).toBeInTheDocument()
    })
})
