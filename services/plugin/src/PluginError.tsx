import React from 'react'

// PLACEHOLDER plugin error component (e.g. for dealing with missing/inaccessible plugin)
// TBD where should this go?
// note that d2-i18n does not work with typescript projects, so we cannot currently translate

// In order to avoid using @dhis2/ui components in the error boundary - as anything
// that breaks within it will not be caught properly - we define a component
// with the same styles as Button

const Info30Grey500 = () => (
    <svg
        height="30"
        viewBox="0 0 24 24"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m12 2c5.5228475 0 10 4.4771525 10 10s-4.4771525 10-10 10-10-4.4771525-10-10 4.4771525-10 10-10zm0 2c-4.418278 0-8 3.581722-8 8s3.581722 8 8 8 8-3.581722 8-8-3.581722-8-8-8zm1 7v6h-2v-6zm-1-4c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1-1-.44771525-1-1 .4477153-1 1-1z"
            fill="#A0ADBA"
        />
    </svg>
)

const PluginError = () => {
    // temporary styling
    const pluginBoundary = {
        backgroundColor: '#F8F9FA',
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column' as const,
    }
    const pluginErrorItems = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        marginBlock: 'auto',
    }

    const pluginErrorText = {
        fontSize: '18px',
        marginBlockStart: '8px',
        color: '#6C7787',
    }

    return (
        <div style={pluginBoundary}>
            <div style={pluginErrorItems}>
                <Info30Grey500 />
                <span style={pluginErrorText}>
                    The requested plugin does not exist or you do not have
                    access
                </span>
            </div>
        </div>
    )
}

export default PluginError
