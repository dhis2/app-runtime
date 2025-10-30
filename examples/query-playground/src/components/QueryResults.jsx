import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Editor } from './Editor.jsx'
import styles from './QueryResults.module.css'

export const QueryResults = ({ result }) => {
    return (
        <div className={styles.results}>
            <Editor
                value={result}
                theme="light"
                readOnly={true}
                name="results"
                placeholder={i18n.t('Results will appear here...')}
            />
        </div>
    )
}

QueryResults.propTypes = {
    result: PropTypes.string,
}
