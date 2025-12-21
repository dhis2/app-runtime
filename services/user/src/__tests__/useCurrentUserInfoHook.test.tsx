import { renderHook } from '@testing-library/react'
import React from 'react'
import { useCurrentUserInfo, UserProvider } from '../UserProvider'

const mockUser = {
    id: 'user123',
    username: 'Test User',
    firstName: 'Test',
    surname: 'User',
    displayName: 'Test User (from UserInfo prop)',
    authorities: [],
    organisationUnits: [],
}

test('When a valid userInfo object is provided', () => {
    const wrapper = ({ children }) => (
        <UserProvider userInfo={mockUser}>{children}</UserProvider>
    )
    const { result } = renderHook(() => useCurrentUserInfo(), { wrapper })
    expect(result.current).toEqual(mockUser)
})

test('When the userInfo object provided is undefined', async () => {
    const wrapper = ({ children }) => (
        <UserProvider userInfo={undefined as any}>{children}</UserProvider>
    )
    const { result } = renderHook(() => useCurrentUserInfo(), { wrapper })
    expect(result.current).toEqual(undefined)
})
