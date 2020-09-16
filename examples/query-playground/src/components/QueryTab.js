import { PropTypes } from '@dhis2/prop-types'
import React from 'react'
import styles from './QueryTab.module.css'

import { QueryEditor } from './QueryEditor'
import { QueryResults } from './QueryResults'

export const QueryTab = ({
    execute,
    query,
    result,
    setQuery,
    setResult,
    setType,
    type,
}) => (
    <div className={styles.container}>
        <div className={styles.inner}>
            <div className={styles.editor}>
                <QueryEditor
                    type={type}
                    query={query}
                    setQuery={setQuery}
                    setResult={setResult}
                    setType={setType}
                    execute={execute}
                />
            </div>

            <div className={styles.results}>
                <QueryResults result={result} />
            </div>
        </div>
    </div>
)

QueryTab.propTypes = {
    execute: PropTypes.func.isRequired,
    result: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,
    setType: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,

    // can be null
    query: PropTypes.string,
}
