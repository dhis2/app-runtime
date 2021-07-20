import { useAlerts } from '@dhis2/app-runtime'
import React from 'react'

export const Alerts = () => {
    const alerts = useAlerts()

    return alerts.map(alert => (
        <div key={alert.id}>
            {alert.message}
            <button
                onClick={() => {
                    /**
                     * FIXME: the next line fails linting during the build, but can't
                     * be disabled since it doesn't fail during linting when committing,
                     * so eslint won't allow disabling it.
                     */
                    alert.options.onHidden?.()
                    alert.remove()
                }}
            >
                hide
            </button>
        </div>
    ))
}
