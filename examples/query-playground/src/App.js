import React, { useState } from 'react'
import styles from './App.styles'

import { QueryEditor } from './components/QueryEditor'
import { QueryResults } from './components/QueryResults'

const QueryRepl = () => {
    const [result, setResult] = useState()

    return (
        <div className="container">
            <style jsx>{styles}</style>
            <div className="inner">
                <QueryEditor setResult={setResult} />
                <QueryResults result={result} />
            </div>
        </div>
    )
}

export default QueryRepl
