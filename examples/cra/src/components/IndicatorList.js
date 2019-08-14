import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

export const IndicatorList = () => {
    const { loading, error, data } = useDataQuery({
        indicators: {
            resource: 'indicators.json',
            order: 'shortName:desc',
            pageSize: 10,
        },
    })
    return (
        <div>
            <h3>Indicators (first 10)</h3>
            {loading && <span>...</span>}
            {error && <span>{`ERROR: ${error.message}`}</span>}
            {data && (
                <pre>
                    {data.indicators.indicators
                        .map(ind => ind.displayName)
                        .join('\n')}
                </pre>
            )}
        </div>
    )
}
