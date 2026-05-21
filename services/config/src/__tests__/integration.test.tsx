import { render } from '@testing-library/react'
import React from 'react'
import { ConfigContext } from '../ConfigContext'
import { ConfigProvider } from '../ConfigProvider'
import { Config } from '../types'

const mockConfig: Config = {
    baseUrl: 'http://test.com',
    serverVersion: {
        full: '2.35-SNAPSHOT',
        major: 2,
        minor: 35,
        patch: undefined,
        tag: 'SNAPSHOT',
    },
    systemInfo: {
        contextPath: 'http://localhost:3000',
        version: '2.35-SNAPSHOT',
        serverTimeZoneId: 'UTC',
    },
}

describe('Testing custom config provider', () => {
    it('Should render without failing', async () => {
        const consumerFunction = jest.fn((config) => `${config.baseUrl}`)
        const { getByText } = render(
            <ConfigProvider config={mockConfig}>
                <ConfigContext.Consumer>
                    {consumerFunction}
                </ConfigContext.Consumer>
            </ConfigProvider>
        )

        expect(getByText(/http:\/\/test.com/i)).not.toBeUndefined()
        expect(consumerFunction).toHaveBeenCalledTimes(1)
        expect(consumerFunction).toHaveBeenLastCalledWith(mockConfig)
    })
})
