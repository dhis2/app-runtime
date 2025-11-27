import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { UserProvider } from '../UserProvider'
import { useCurrentUserInfo } from '../useCurrentUserInfo'
import { CustomDataProvider } from '@dhis2/app-service-data'

const mockUserProvidedViaProps = {
   id: 'user123',
    username: 'Test User',
    firstName: 'Test',
    surname: 'User',
    displayName: 'Test User (from UserInfo prop)',
    authorities: [],
    organisationUnits: []
}

const mockUserFetchedViaDataQuery = {
    id: 'remoteUser123',
    username: 'remoteUser',
    firstName: 'Remote',
    surname: 'User',
    displayName: 'Remote User (from data query)',
    authorities: [],
    organisationUnits: []
}


test('returns the user from props when userInfo is provided', () => {
    const wrapper = ({ children }) => (
        <CustomDataProvider data={{}}>
            <UserProvider userInfo={mockUserProvidedViaProps}>
                {children}
            </UserProvider>
        </CustomDataProvider>
    )

    const { result } = renderHook(() => useCurrentUserInfo(), { wrapper })

    expect(result.current.user).toEqual(mockUserProvidedViaProps)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
})


test('fetches user via useDataQuery when userInfo is not provided', async () => {
    const mockData = {
        me: async () => mockUserFetchedViaDataQuery
    }

    const wrapper = ({ children }) => (
        <CustomDataProvider data={mockData}>
            <UserProvider userInfo={undefined}>
                {children}
            </UserProvider>
        </CustomDataProvider>
    )

    const { result } = renderHook(() => useCurrentUserInfo(), { wrapper })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeUndefined()

    await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.user).toEqual(mockUserFetchedViaDataQuery)
    })
})
