import React from 'react'
import type { Alert } from './types'

export const AlertsContext = React.createContext<Alert[]>([])
