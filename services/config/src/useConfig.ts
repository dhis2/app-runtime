import { useContext } from 'react'
import { ConfigContext } from './ConfigContext'

export const useConfig = () => useContext(ConfigContext)
