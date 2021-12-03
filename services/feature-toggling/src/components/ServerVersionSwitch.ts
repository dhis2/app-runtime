import { useConfig } from '@dhis2/app-service-config'
import React from 'react'
import { ServerVersionCase, ServerVersionCaseProps } from './ServerVersionCase'

const parseVersion = (v: string): number[] => {
    return v
        .split('.')
        .map(segment => parseInt(segment))
        .map(segment => (typeof segment !== 'number' ? 0 : segment))
}
const versionCompare = (a: string, b: string) => {
    const parsedA = parseVersion(a)
    const parsedB = parseVersion(b)
    let index = 0
    while (index++ < parsedA.length) {
        const aValue = parsedA[index]
        const bValue = parsedB[index] || 0
        if (aValue > bValue) {
            return 1
        } else if (aValue < bValue) {
            return -1
        }
    }
    return 0
}

export const ServerVersionSwitch = ({
    children,
}: {
    children: React.ReactElement<ServerVersionCaseProps>
}) => {
    const { systemInfo } = useConfig()
    const serverVersion = systemInfo?.version

    let matchingChild: React.ReactElement<ServerVersionCaseProps> | null = null

    React.Children.forEach(children, child => {
        if (!matchingChild && child?.type === ServerVersionCase) {
            const { min, max } = child.props
            if (!min && !max) {
                matchingChild = child
                return
            }
            if (
                serverVersion &&
                (!min || versionCompare(min, serverVersion) <= 0) &&
                (!max || versionCompare(max, serverVersion) >= 0)
            ) {
                matchingChild = child
                return
            }
        }
    })

    return matchingChild
}
