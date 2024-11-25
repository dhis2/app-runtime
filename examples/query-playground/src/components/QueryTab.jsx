import { PropTypes } from 'prop-types'
import React from 'react'
import { QueryEditor } from './QueryEditor.jsx'
import { QueryResults } from './QueryResults.jsx'
import styles from './QueryTab.module.css'

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
