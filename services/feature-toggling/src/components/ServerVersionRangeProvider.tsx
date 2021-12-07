import React from 'react'
import { ServerVersionRangeContext } from '../context/ServerVersionRangeContext'
import { ServerVersionRange } from '../types'

const makeContext = (range: ServerVersionRange) => range

export const ServerVersionRangeProvider = ({
    range,
    children,
}: {
    range: ServerVersionRange
    children: React.ReactNode
}) => (
    <ServerVersionRangeContext.Provider value={makeContext(range)}>
        {children}
    </ServerVersionRangeContext.Provider>
)
