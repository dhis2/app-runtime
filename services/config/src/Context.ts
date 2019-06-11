import React from 'react'
import { Config } from './types'

export const Context = React.createContext<Config>({
    baseUrl: '..',
    apiVersion: 32,
})
