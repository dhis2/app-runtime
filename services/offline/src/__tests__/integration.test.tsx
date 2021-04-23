import { render } from '@testing-library/react'
import React from 'react'
import { OfflineProvider } from '../components/OfflineProvider'
import { OfflineContext } from '../context/OfflineContext'
import { OfflineConfig } from '../types'

const mockOptions: OfflineConfig = {
    cache: {
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        update: jest.fn(),
        has: jest.fn(),
    },
    getIsOnline: jest.fn(),
    subscribe: jest.fn(),
}

describe('Testing custom config provider', () => {
    it('Should render without failing', async () => {
        const consumerFunction = jest.fn(() => 'This is a test')
        const { getByText } = render(
            <OfflineProvider options={mockOptions}>
                <OfflineContext.Consumer>
                    {consumerFunction}
                </OfflineContext.Consumer>
            </OfflineProvider>
        )

        expect(getByText(/This is a test/i)).not.toBeUndefined()
        expect(consumerFunction).toHaveBeenCalledTimes(1)
    })
})
