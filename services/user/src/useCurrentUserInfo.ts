import { useContext } from 'react'
import { UserContext } from './UserContext'

export const useCurrentUserInfo = () => useContext(UserContext)
