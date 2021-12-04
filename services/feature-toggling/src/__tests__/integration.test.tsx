import { render } from '@testing-library/react'
import React from 'react'
import { ServerVersionRangeProvider } from '../components/ServerVersionRangeProvider'
import { ServerVersionRangeContext } from '../context/ServerVersionRangeContext'
import { ServerVersionRange } from '../types'

const mockConfig: ServerVersionRange = {
    min: '2.34',
    max: '2.35.2',
}

describe('Testing custom config provider', () => {
    it('Should render without failing', async () => {
        const consumerFunction = jest.fn(range => `${range.min}:${range.max}`)
        const { getByText } = render(
            <ServerVersionRangeProvider range={{ min: '2.34', max: '2.35.2' }}>
                <ServerVersionRangeContext.Consumer>
                    {consumerFunction}
                </ServerVersionRangeContext.Consumer>
            </ServerVersionRangeProvider>
        )

        expect(getByText(/2.34:2.35.2/i)).not.toBeUndefined()
        expect(consumerFunction).toHaveBeenCalledTimes(1)
        expect(consumerFunction).toHaveBeenLastCalledWith(mockConfig)
    })
})
