import { PropTypes } from '@dhis2/prop-types'
import React from 'react'
import styles from './QueryTab.module.css'

import { QueryEditor } from './QueryEditor'
import { QueryResults } from './QueryResults'

export const QueryTab = ({ query, result, setQuery, setResult }) => (
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

QueryTab.propTypes = {
    result: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,

    // can be null
    query: PropTypes.string,
}
