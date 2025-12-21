import React, { useContext } from 'react'
import { CurrentUser } from './types'

const UserContext = React.createContext<CurrentUser | undefined>(undefined)

export const UserProvider = ({
    userInfo,
    children,
}: {
    userInfo: CurrentUser | undefined
    children: React.ReactNode
}) => {
    return (
        <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    )
}

export const useCurrentUserInfo = () => useContext(UserContext)
