import React from 'react'

import { render } from '@testing-library/react'
import { ConfigProvider } from '../ConfigProvider'
import { Config } from '../types'
import { ConfigContext } from '../ConfigContext'

const mockConfig: Config = {
    baseUrl: 'http://test.com',
    apiVersion: 42,
}

describe('Testing custom config provider', () => {
    it('Should render without failing', async () => {
        const consumerFunction = jest.fn(
            config => `${config.baseUrl}:${config.apiVersion}`
        )
        const { getByText } = render(
            <ConfigProvider config={mockConfig}>
                <ConfigContext.Consumer>
                    {consumerFunction}
                </ConfigContext.Consumer>
            </ConfigProvider>
        )

        expect(getByText(/http:\/\/test.com:42/i)).not.toBeUndefined()
        expect(consumerFunction).toHaveBeenCalledTimes(1)
        expect(consumerFunction).toHaveBeenLastCalledWith(mockConfig)
    })
})
