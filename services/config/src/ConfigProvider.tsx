import React from 'react'
import { ConfigContext } from './ConfigContext'
import { Config } from './types'

const makeContext = (config: Config) => config

export const ConfigProvider = ({
    config,
    children,
}: {
    config: Config
    children: React.ReactNode
}) => (
    <ConfigContext.Provider value={makeContext(config)}>
        {children}
    </ConfigContext.Provider>
)
