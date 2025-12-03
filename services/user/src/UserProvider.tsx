import React, { useContext } from 'react'
import { CurrentUser } from './types'

const defaultUser: CurrentUser = {
    id: '..',
    username: '..',
    displayName: '..',
    authorities: [],
    organisationUnits: [],
}

const UserContext = React.createContext<CurrentUser>(defaultUser)

export const UserProvider = ({
    userInfo,
    children,
}: {
    userInfo: CurrentUser
    children: React.ReactNode
}) => {
    return (
        <UserContext.Provider value={userInfo ?? defaultUser}>
            {children}
        </UserContext.Provider>
    )
}

export const useCurrentUserInfo = () => useContext(UserContext)
