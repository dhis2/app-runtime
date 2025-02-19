import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { QueryRepl } from './QueryRepl.jsx'

export default function App() {
    return (
        <>
            <CssVariables colors />
            <QueryRepl />
        </>
    )
}
