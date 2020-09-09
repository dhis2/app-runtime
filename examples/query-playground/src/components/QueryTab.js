import { PropTypes } from '@dhis2/prop-types'
import React, { useState } from 'react'
import styles from './QueryTab.module.css'

import { QueryEditor } from './QueryEditor'
import { QueryResults } from './QueryResults'

export const QueryTab = ({ active }) => {
    const [query, setQuery] = useState(null)
    const [result, setResult] = useState('')

    if (!active) return null

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.editor}>
                    <QueryEditor
                        query={query}
                        setQuery={setQuery}
                        setResult={setResult}
                    />
                </div>

                <div className={styles.results}>
                    <QueryResults result={result} />
                </div>
            </div>
        </div>
    )
}

QueryTab.propTypes = {
    active: PropTypes.bool.isRequired,
}
