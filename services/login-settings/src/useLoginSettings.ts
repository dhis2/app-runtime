import { useContext } from 'react'
import { LoginSettingsContext } from './LoginSettingsContext'

export const useLoginSettings = () => useContext(LoginSettingsContext)
