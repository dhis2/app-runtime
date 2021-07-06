import { render } from '@testing-library/react'
import React from 'react'
import { OfflineProvider } from '../lib/offline-provider'

const mockOfflineInterface = {
    init: jest.fn(),
    startRecording: jest.fn().mockResolvedValue(),
    getCachedSections: jest.fn().mockResolvedValue(['TODO: Dummy sections']),
    removeSection: jest.fn().mockResolvedValue(true),
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('Testing offline provider', () => {
    it('Should render without failing', async () => {
        const wrapper = render(
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                <div data-testid="test-div" />
            </OfflineProvider>
        )

        expect(wrapper.findByTestId('test-div')).toBeDefined()
    })

    it('Should initialize the offline interface with an update prompt', () => {
        render(
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                {/* TODO */}
            </OfflineProvider>
        )

        expect(mockOfflineInterface.init).toHaveBeenCalledTimes(1)

        // Expect to have been called with a 'promptUpdate' function
        const arg = mockOfflineInterface.init.mock.calls[0][0]
        expect(arg).toHaveProperty('promptUpdate')
        expect(typeof arg['promptUpdate']).toBe('function')
    })
})
