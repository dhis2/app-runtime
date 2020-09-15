import { Button, Radio } from '@dhis2/ui'
import { useConfig } from '@dhis2/app-runtime'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Editor } from './Editor'
import i18n from '@dhis2/d2-i18n'
import styles from './QueryEditor.module.css'

const defaultQuery = {
    me: {
        resource: 'me',
        params: {
            fields: ['id', 'name', 'email', 'introduction'],
        },
    },
}

const defaultMutation = {
    resource: 'me',
    type: 'update',
    data: {
        introduction: 'Hello, World!',
    },
}

const getDefaultQueryByType = type =>
    JSON.stringify(type === 'query' ? defaultQuery : defaultMutation, null, 4)

export const QueryEditor = ({
    query,
    execute,
    setQuery,
    setResult,
    setType,
    type,
}) => {
    const { baseUrl, apiVersion } = useConfig()
    const [error, setError] = useState(null)

    const onClick = () => {
        try {
            setError(null)

            const parsed = JSON.parse(
                query === null ? getDefaultQueryByType(type) : query
            )

            execute({ query: parsed, type }).then(setResult)
        } catch (e) {
            setError(`JSON Parse Error: ${e}`)
        }
    }

    const currentQuery =
        typeof query === 'string' ? query : getDefaultQueryByType(type)

    const onEnterPress = event =>
        (event.ctrlKey || event.metaKey) && event.key === 'Enter' && onClick()

    return (
        <div className={styles.editor} onKeyPress={onEnterPress}>
            <Editor
                value={currentQuery}
                theme="monokai"
                onChange={setQuery}
                name="editor"
                placeholder={i18n.t('Enter a query here...')}
                focus={true}
            />

            {error && <span className={styles.error}>{error}</span>}

            <div className={styles.controls}>
                <div className={styles.queryMetaData}>
                    <div className={styles.radioFields}>
                        <span className={styles.queryTypeLabel}>Type:</span>

                        <Radio
                            name="type"
                            className={styles.typeInputQuery}
                            checked={type === 'query'}
                            label={i18n.t('Query')}
                            value="query"
                            onChange={({ value }) => setType(value)}
                        />

                        <Radio
                            name="type"
                            checked={type === 'mutation'}
                            label={i18n.t('Mutation')}
                            value="mutation"
                            onChange={({ value }) => setType(value)}
                        />
                    </div>

                    <p className={styles.server}>
                        <span className={styles.serverLabel}>Server url:</span>

                        <a
                            className={styles.serverLink}
                            href={baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {baseUrl}
                        </a>

                        <br />

                        <span className={styles.apiVersionLabel}>
                            Api version:
                        </span>

                        {apiVersion}
                    </p>
                </div>

                <div>
                    <Button primary onClick={onClick}>
                        {i18n.t('Execute')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

QueryEditor.propTypes = {
    execute: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,
    setType: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    query: PropTypes.string,
}
