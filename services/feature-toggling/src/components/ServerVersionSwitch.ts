import { useConfig } from '@dhis2/app-service-config'
import React from 'react'
import { versionCompare } from '../helpers/versionCompare'
import { ServerVersionCase, ServerVersionCaseProps } from './ServerVersionCase'

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
