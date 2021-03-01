import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { QueryRepl } from './QueryRepl'

export default function App() {
    return (
        <>
            <CssVariables colors />
            <QueryRepl />
        </>
    )
}
