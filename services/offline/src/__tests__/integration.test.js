import { render } from '@testing-library/react'
import React from 'react'
import { OfflineProvider } from '../components/OfflineProvider'

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
