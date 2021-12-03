import React from 'react'
import { PropsWithChildren } from 'react'
import { ServerVersionRange } from '../types'
import { ServerVersionRangeProvider } from './ServerVersionRangeProvider'

export const ServerVersionCase = ({
    min,
    max,
    children,
}: PropsWithChildren<ServerVersionCaseProps>) => {
    return (
        <ServerVersionRangeProvider range={{ min, max }}>
            {children}
        </ServerVersionRangeProvider>
    )
}

export type ServerVersionCaseProps = ServerVersionRange
