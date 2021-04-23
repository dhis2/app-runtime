import React from 'react'
import { makeContext } from '../context/makeContext'
import { OfflineContext } from '../context/OfflineContext'
import { OfflineConfig } from '../types'

export const OfflineProvider = ({
    options,
    children,
}: {
    options: OfflineConfig
    children: React.ReactNode
}) => (
    <OfflineContext.Provider value={makeContext(options)}>
        {children}
    </OfflineContext.Provider>
)
