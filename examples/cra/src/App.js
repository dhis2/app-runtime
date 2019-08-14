import React from 'react'
import './App.css'
import { SwitchableProvider } from './components/SwitchableProvider'
import { ConfigConsumer } from './components/ConfigConsumer'
import { IndicatorList } from './components/IndicatorList'

const App = () => {
    const config = {
        baseUrl:
            process.env.REACT_APP_D2_BASE_URL || 'https://play.dhis2.org/dev',
        apiVersion: process.env.REACT_APP_D2_API_VERSION || 33,
    }
    const providerType = (
        process.env.REACT_APP_D2_PROVIDER_TYPE || 'runtime'
    ).toLowerCase()
    return (
        <SwitchableProvider type={providerType} config={config}>
            <div className="App">
                <header className="App-header">
                    <ConfigConsumer />
                    <IndicatorList />
                </header>
            </div>
        </SwitchableProvider>
    )
}

export default App
