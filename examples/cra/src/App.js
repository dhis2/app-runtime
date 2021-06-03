import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import { Alerts } from './components/Alerts'
import { ConfigConsumer } from './components/ConfigConsumer'
import { IndicatorList } from './components/IndicatorList'
import { SwitchableProvider } from './components/SwitchableProvider'

const config = {
    baseUrl: process.env.REACT_APP_D2_BASE_URL || 'http://localhost:8080',
    apiVersion: process.env.REACT_APP_D2_API_VERSION || 33,
}

const providerType = (
    process.env.REACT_APP_D2_PROVIDER_TYPE || 'runtime'
).toLowerCase()

const App = () => {
    const engine = useDataEngine()
    const queryFn = ({ queryKey }) => {
        const [query] = queryKey
        return engine.query(query)
    }
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn,
            },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <SwitchableProvider type={providerType} config={config}>
                <div className="App">
                    <header className="App-header">
                        <ConfigConsumer />
                        <IndicatorList />
                        <Alerts />
                    </header>
                </div>
            </SwitchableProvider>
        </QueryClientProvider>
    )
}

export default App
