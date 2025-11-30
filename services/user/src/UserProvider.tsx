import React, { useContext } from 'react'
import { CurrentUser } from './types'


const UserContext = React.createContext<CurrentUser>({
    id: '..',
    username: '..',
    displayName: '..',
    authorities: [],
    organisationUnits: []
})

export const UserProvider = ({
    userInfo,
    children,
}: {
    userInfo: CurrentUser
    children: React.ReactNode
}) => {
    return <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
}

export const useCurrentUserInfo = () => useContext(UserContext)




