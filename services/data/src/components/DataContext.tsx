import React from 'react'
import { ContextType } from '../types/Context'
import { defaultContext } from '../context/defaultContext'

export const DataContext = React.createContext<ContextType>(defaultContext)
