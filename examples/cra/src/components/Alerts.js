import React from 'react'
import { useAlerts } from '@dhis2/app-runtime'

export const Alerts = () => {
    const alerts = useAlerts()

    console.log(alerts)
    return alerts.map(alert => <div key={alert.message}>{alert.message}</div>)
}
