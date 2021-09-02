import React from 'react'
import './App.css'
import { Alerts } from './components/Alerts'
import { ConfigConsumer } from './components/ConfigConsumer'
import { IndicatorList } from './components/IndicatorList'
import { OnlineStatus } from './components/OnlineStatus'
import { SwitchableProvider } from './components/SwitchableProvider'

const config = {
    baseUrl: process.env.REACT_APP_D2_BASE_URL || 'http://localhost:8080',
    apiVersion: process.env.REACT_APP_D2_API_VERSION || 33,
}

const providerType = (
    process.env.REACT_APP_D2_PROVIDER_TYPE || 'runtime'
).toLowerCase()

const App = () => {
    return (
        <SwitchableProvider type={providerType} config={config}>
            <div className="App">
                <header className="App-header">
                    <OnlineStatus />
                    <ConfigConsumer />
                    <IndicatorList />
                    <Alerts />
                </header>
            </div>
        </SwitchableProvider>
    )
}

export default App
