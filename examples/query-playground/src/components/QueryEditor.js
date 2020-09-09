import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, FieldGroup, Radio } from '@dhis2/ui'
import styles from './QueryEditor.styles'
import { useDataEngine } from '@dhis2/app-runtime'
import { Editor } from './Editor'
import i18n from '@dhis2/d2-i18n'

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

const stringify = obj => JSON.stringify(obj, undefined, 2)

export const QueryEditor = ({ query, setQuery, setResult }) => {
    const [type, setType] = useState('query')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const engine = useDataEngine()

    const onClick = () => {
        setLoading(true)
        setResult('...')
        setError(null)

        try {
            const parsed = JSON.parse(
                query === null ? getDefaultQueryByType(type) : query
            )
            const promise =
                type === 'query' ? engine.query(parsed) : engine.mutate(parsed)

            promise
                .then(result => {
                    setLoading(false)
                    setResult(stringify(result))
                })
                .catch(error => {
                    setLoading(false)
                    setError(String(error))
                    setResult(
                        `ERROR: ${error.message}\n${stringify(error.details)}`
                    )
                })
        } catch (e) {
            setError(`JSON Parse Error: ${e}`)
            setLoading(false)
            setResult('ERROR: ')
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
                    <FieldGroup
                        name="type"
                        label="Type"
                        onChange={({ value }) =>
                            console.log(value) || setType(value)
                        }
                        value={type}
                    >
                        <Radio label={i18n.t('Query')} value="query" />
                        <Radio label={i18n.t('Mutation')} value="mutation" />
                    </FieldGroup>
                </div>
                <Button
                    className="execute-button"
                    primary
                    disabled={loading}
                    onClick={onClick}
                >
                    {i18n.t('Execute')}
                </Button>
            </div>
        </div>
    )
}

QueryEditor.propTypes = {
    setQuery: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,
    query: PropTypes.string,
}
