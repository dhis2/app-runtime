import React from 'react'
import { ContextType } from '../../types'
import { defaultDataContext } from './defaultDataContext'

export const DataContext = React.createContext<ContextType>(defaultDataContext)
