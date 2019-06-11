import React from 'react'
import { Context } from './Context'
import { Config } from './types'

const makeContext = (config: Config) => config

export const Provider = ({
    config,
    children,
}: {
    config: Config
    children: React.ReactNode
}) => (
    <Context.Provider value={makeContext(config)}>{children}</Context.Provider>
)
