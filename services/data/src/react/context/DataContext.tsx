import React from 'react'
import { ContextType } from '../../types'
import { defaultContext } from './defaultContext'

export const DataContext = React.createContext<ContextType>(defaultContext)
