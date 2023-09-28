import { render } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LoginSettingsContext } from '../LoginSettingsContext'
import { LoginSettingsProvider } from '../LoginSettingsProvider'

describe('LoginSettings Context', () => {
    it('Should return default values if query fails', async () => {
        // no DHIS2 Data context is initialized, so provider will fall back to default values
        const queryClient = new QueryClient()
        const consumerFunction = jest.fn(
            (loginSettings) => `${loginSettings.uiLocale}`
        )
        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <LoginSettingsProvider>
                    <LoginSettingsContext.Consumer>
                        {consumerFunction}
                    </LoginSettingsContext.Consumer>
                </LoginSettingsProvider>
            </QueryClientProvider>
        )

        expect(getByText('en')).not.toBeUndefined()
        expect(consumerFunction).toHaveBeenCalledTimes(1)
    })
})
