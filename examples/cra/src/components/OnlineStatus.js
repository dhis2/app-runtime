import { useOnlineStatus } from '@dhis2/app-runtime'
import React from 'react'

export const OnlineStatus = () => {
    const { online } = useOnlineStatus()
    return <p>{online ? 'Online' : 'Offline'}</p>
}
