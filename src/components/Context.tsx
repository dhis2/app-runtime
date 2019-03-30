import React from 'react'
import { ContextType } from '../types/Context'
import { defaultContext } from '../context/defaultContext'

export const Context = React.createContext<ContextType>(defaultContext)
