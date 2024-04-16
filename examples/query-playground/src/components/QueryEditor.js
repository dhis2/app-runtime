import i18n from '@dhis2/d2-i18n'
import { Button, Radio } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Editor } from './Editor'
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

const getDefaultQueryByType = (type) =>
    JSON.stringify(type === 'query' ? defaultQuery : defaultMutation, null, 4)

export const QueryEditor = ({
    query,
    execute,
    setQuery,
    setResult,
    setType,
    type,
}) => {
    const [error, setError] = useState(null)

    const currentQuery =
        typeof query === 'string' ? query : getDefaultQueryByType(type)

    const onExecute = () => {
        setError(null)

        let parsed
        try {
            parsed = JSON.parse(currentQuery)
        } catch (e) {
            setError(`JSON Parse Error: ${e}`)
            return
        }
        execute({ query: parsed, type }).then(setResult)
    }

    const onKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            onExecute()
            event.stopPropagation()
        }
    }

    return (
        <div className={styles.editor} onKeyDown={onKeyDown}>
            <Editor
                value={currentQuery}
                theme="dark"
                onChange={setQuery}
                name="editor"
                placeholder={i18n.t('Enter a query here...')}
                autoFocus={true}
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
                </div>

                <div>
                    <Button primary onClick={onExecute}>
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
