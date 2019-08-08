import React from 'react'
import { Config } from './types'

export const ConfigContext = React.createContext<Config>({
    baseUrl: '..',
    apiVersion: 32,
})
