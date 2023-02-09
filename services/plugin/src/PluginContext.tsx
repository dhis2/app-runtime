import React, { ReactElement, createContext, useContext, useState } from 'react'

type PluginContextType = {
    onPluginError: any
    setOnPluginError: any
    parentAlertsAdd: any
    setParentAlertsAdd: any
    showAlertsInPlugin: boolean
    setShowAlertsInPlugin: any
    clearPluginError: any
    setClearPluginError: any
}

const PluginContext = createContext<PluginContextType>({
    onPluginError: null,
    setOnPluginError: null,
    parentAlertsAdd: null,
    setParentAlertsAdd: null,
    showAlertsInPlugin: false,
    setShowAlertsInPlugin: null,
    clearPluginError: null,
    setClearPluginError: null,
})

// TO DO: implement different component if not plugin

const PluginProvider = ({
    children,
}: {
    children: React.ReactNode
}): ReactElement => {
    const [onPluginError, setOnPluginError] = useState(null)
    const [parentAlertsAdd, setParentAlertsAdd] = useState(null)
    const [showAlertsInPlugin, setShowAlertsInPlugin] = useState(false)
    const [clearPluginError, setClearPluginError] = useState(null)
    const providerValue = {
        onPluginError,
        setOnPluginError,
        parentAlertsAdd,
        setParentAlertsAdd,
        showAlertsInPlugin,
        setShowAlertsInPlugin,
        clearPluginError,
        setClearPluginError,
    }
    return (
        <PluginContext.Provider value={providerValue}>
            {children}
        </PluginContext.Provider>
    )
}

const usePluginContext = () => useContext(PluginContext)

export { PluginContext, PluginProvider, usePluginContext }
