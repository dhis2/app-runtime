import { useContext } from 'react'
import { Context } from './Context'

export const useConfig = () => useContext(Context)
