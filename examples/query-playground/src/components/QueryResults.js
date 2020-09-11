import React from 'react'
import PropTypes from 'prop-types'
import styles from './QueryResults.module.css'
import { Editor } from './Editor'
import i18n from '@dhis2/d2-i18n'

export const QueryResults = ({ result }) => {
    return (
        <div className={styles.results}>
            <style jsx>{styles}</style>
            <Editor
                value={result}
                theme="github"
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
