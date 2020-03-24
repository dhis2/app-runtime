import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDataMutation } from '@dhis2/app-runtime'
import { DeleteButton } from './DeleteButton'

const mutation = {
    resource: 'indicators',
    id: ({ id }) => id,
    type: 'update',
    partial: true,
    data: ({ name }) => ({
        name,
    }),
}

export const Indicator = ({ indicator, onChange }) => {
    const [editing, setEditing] = useState(false)
    const [mutate, { loading, error }] = useDataMutation(mutation)

    const inputRef = useRef()

    const doMutation = async () => {
        await mutate({
            id: indicator.id,
            name: inputRef.current.value,
        })
        setEditing(false)
        onChange()
    }

    const edit = () => {
        setEditing(true)
    }

    if (error) {
        console.error(error)
    }

    return (
        <div>
            {!editing && <span>{indicator.displayName}</span>}
            {editing && (
                <input
                    ref={inputRef}
                    disabled={loading}
                    type="text"
                    style={{ padding: 5, width: 300, textAlign: 'center' }}
                    defaultValue={indicator.displayName}
                />
            )}
            {error && <span style={{ color: 'red' }}>ERROR</span>}
            {!error && (
                <button
                    onClick={editing ? doMutation : edit}
                    disabled={loading}
                >
                    {editing ? 'Submit' : 'Edit'}
                </button>
            )}
            <DeleteButton indicatorId={indicator.id} onDelete={onChange} />
        </div>
    )
}

Indicator.propTypes = {
    indicator: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
}
