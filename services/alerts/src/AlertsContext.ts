import React from 'react'
import { AlertsManagerAlert } from './types'

export const AlertsContext = React.createContext<AlertsManagerAlert[]>([])
