import React from 'react'
import { ServerVersionRange } from '../types'

export const ServerVersionRangeContext = React.createContext<ServerVersionRange>(
    {
        min: '',
        max: '',
    }
)
