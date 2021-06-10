import { render } from '@testing-library/react'
import React from 'react'
import { OfflineProvider } from '../lib/offline-provider'

const mockOfflineInterface = {
    init: jest.fn(),
    startRecording: async () => null,
    getCachedSections: async () => [],
    removeSection: async () => null,
}

describe('Testing offline provider', () => {
    it('Should render without failing', async () => {
        render(
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                {/* TODO */}
            </OfflineProvider>
        )

        expect(mockOfflineInterface.init).toHaveBeenCalledTimes(1)
    })
})
