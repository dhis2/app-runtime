import React from 'react'
import { useDataQuery } from '@dhis2/app-service-data'
import { UserContext } from './UserContext'
import { CurrentUser, CurrentUserState } from './types'

const query = {
    me: {
        resource: 'me',
    },
}

export const UserProvider = ({
    userInfo,
    children,
}: {
    userInfo: CurrentUser | undefined
    children: React.ReactNode
}) => {

    const { loading, error, data, refetch } = useDataQuery<{me:CurrentUser}>(query, {
        lazy: !!userInfo,
    })

    const value: CurrentUserState = userInfo
        ? { user: userInfo, loading: false, error: undefined, refetch: ()=>{} }
        : { user: data?.me, loading, error, refetch }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}




