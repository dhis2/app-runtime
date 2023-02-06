import React, { createContext, Dispatch, useContext, useState } from 'react'

type PluginErrorContextType = {
    onPluginError: any
    setOnPluginError: any
}

const PluginErrorContext = createContext<PluginErrorContextType>({
    onPluginError: null,
    setOnPluginError: null,
})

const PluginErrorProvider = ({ children }: { children: React.Component }) => {
    const [onPluginError, setOnPluginError] = useState(null)
    const providerValue = {
        onPluginError,
        setOnPluginError,
    }
    return (
        <PluginErrorContext.Provider value={providerValue}>
            {children}
        </PluginErrorContext.Provider>
    )
}

const usePluginErrorContext = () => useContext(PluginErrorContext)

export { PluginErrorContext, PluginErrorProvider, usePluginErrorContext }
