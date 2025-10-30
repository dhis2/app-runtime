import { CssVariables } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { DataEngine, RestAPILink } from '@dhis2/data-engine'
import { QueryRepl } from './QueryRepl.jsx'
import { useConfig } from '@dhis2/app-runtime'

export default function App() {
    const config = useConfig()

    useEffect(() => {
        // Initialize a new global DataEngine (window.engine) which can be used
        // to test the programmatic non-react interface using the browser console
        window.engine = new DataEngine(new RestAPILink(config))
    }, [config])

    return (
        <>
            <CssVariables colors />
            <QueryRepl />
        </>
    )
}
