import React from 'react'
import { CurrentUserState } from './types'

export const UserContext = React.createContext<CurrentUserState>({
    user: undefined,
    loading: true,
    error: undefined,
    refetch: ()=>{},
})