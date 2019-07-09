import React from 'react'
import './App.css'
import { useConfig, useDataQuery } from '@dhis2/app-runtime'

const App = () => {
    const config = useConfig()
    const { loading, error, data } = useDataQuery({
        indicators: {
            resource: 'indicators.json',
            order: 'shortName:desc',
            pageSize: 10,
        },
    })
    return (
        <div className="App">
            <header className="App-header">
                <span>
                    <strong>Base url:</strong> {config.baseUrl}
                </span>
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
            </header>
        </div>
    )
}

export default App
