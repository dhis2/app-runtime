import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { CustomDataProvider } from '@dhis2/app-service-data'
import { UserProvider } from '../UserProvider'
import { UserContext } from '../UserContext'
import { CurrentUser } from '../types'

const mockUserFromProp: CurrentUser = {
    id: 'user123',
    username: 'Test User',
    firstName: 'Test',
    surname: 'User',
    displayName: 'Test User (from UserInfo prop)',
    authorities: [],
    organisationUnits: []
}

const mockUserFromQuery: CurrentUser = {
    id: 'remoteUser123',
    username: 'remoteUser',
    firstName: 'Remote',
    surname: 'User',
    displayName: 'Remote User (from data query)',
    authorities: [],
    organisationUnits: []
}

describe('UserProvider Integration using CustomDataProvider', () => {

    it('should use userInfo prop and not run useDataQuery', () => {
        const consumerFn = jest.fn(() => null)

        render(
            <CustomDataProvider data={{}}>
                <UserProvider userInfo={mockUserFromProp}>
                    <UserContext.Consumer>{consumerFn}</UserContext.Consumer>
                </UserProvider>
            </CustomDataProvider>
        )

        expect(consumerFn).toHaveBeenCalledTimes(1)
        expect(consumerFn).toHaveBeenCalledWith(
            expect.objectContaining({
                user: mockUserFromProp,
                loading: false,
                error: undefined,
                refetch: expect.any(Function),
            })
        )
    })

    it('should fetch user using DataProvider when userInfo is undefined', async () => {
        const consumerFn = jest.fn(() => null)

        const wrapper = ({ children }) => (
            <CustomDataProvider data={{ me: mockUserFromQuery as any }}>
                {children}
            </CustomDataProvider>
        )

        render(
            <UserProvider userInfo={undefined}>
                <UserContext.Consumer>{consumerFn}</UserContext.Consumer>
            </UserProvider>,
            { wrapper }
        )

        expect(consumerFn).toHaveBeenCalledWith(
            expect.objectContaining({
                loading: true,
                user: undefined,
            })
        )

        await waitFor(() => {
            expect(consumerFn).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    user: mockUserFromQuery,
                    loading: false,
                    error: undefined,
                    refetch: expect.any(Function),
                })
            )
        })
    })
})

