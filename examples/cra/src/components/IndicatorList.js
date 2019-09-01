import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Indicator } from './Indicator'
import { AddButton } from './AddButton'

const query = ({ page = 1 }) => ({
    indicators: {
        resource: 'indicators.json',
        order: 'displayName:asc',
        fields: '*',
        page,
        pageSize: 10,
    },
})

export const IndicatorList = () => {
    const { loading, error, data, refetch } = useDataQuery(query)
    return (
        <div>
            <h3>Indicators</h3>
            {loading && <span>...</span>}
            {error && <span>{`ERROR: ${error.message}`}</span>}
            {data && (
                <>
                    <pre>
                        {data.indicators.indicators.map(ind => (
                            <Indicator
                                key={ind.id}
                                indicator={ind}
                                onChange={() => refetch()}
                            />
                        ))}
                    </pre>
                    <div style={{ fontSize: '0.8rem' }}>
                        Page {data.indicators.pager.page} of{' '}
                        {data.indicators.pager.pageCount}
                    </div>
                    <button
                        disabled={data.indicators.pager.page === 1}
                        onClick={() =>
                            refetch({ page: data.indicators.pager.page - 1 })
                        }
                    >
                        &lt;- Previous
                    </button>
                    <AddButton onCreate={() => refetch()} />
                    <button
                        disabled={
                            data.indicators.pager.page ===
                            data.indicators.pager.pageCount
                        }
                        onClick={() =>
                            refetch({ page: data.indicators.pager.page + 1 })
                        }
                    >
                        Next -&gt;
                    </button>
                </>
            )}
        </div>
    )
}
