import { Button, FieldGroup, Radio } from '@dhis2/ui'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Editor } from './Editor'
import i18n from '@dhis2/d2-i18n'
import styles from './QueryEditor.styles'

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
        event.ctrlKey && event.key === 'Enter' && onClick()

    return (
        <div className="editor" onKeyPress={onEnterPress}>
            <style jsx>{styles}</style>
            <Editor
                value={currentQuery}
                theme="monokai"
                onChange={setQuery}
                name="editor"
                placeholder={i18n.t('Enter a query here...')}
                focus={true}
            />
            {error && <span className="error">{error}</span>}
            <div className="controls">
                <div className="radio-group">
                    <FieldGroup name="type" label="Type">
                        <Radio
                            checked={type === 'query'}
                            label={i18n.t('Query')}
                            value="query"
                            onChange={({ value }) => setType(value)}
                        />

                        <Radio
                            checked={type === 'mutation'}
                            label={i18n.t('Mutation')}
                            value="mutation"
                            onChange={({ value }) => setType(value)}
                        />
                    </FieldGroup>
                </div>
                <Button className="execute-button" primary onClick={onClick}>
                    {i18n.t('Execute')}
                </Button>
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
