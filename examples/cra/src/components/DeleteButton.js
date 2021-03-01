import { useDataMutation } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'

const mutation = {
    resource: 'indicators',
    id: ({ id }) => id,
    type: 'delete',
}

export const DeleteButton = ({ indicatorId, onDelete }) => {
    const [mutate] = useDataMutation(mutation, {
        onComplete: onDelete,
        variables: {
            id: indicatorId,
        },
    })

    return <button onClick={mutate}>Delete</button>
}

DeleteButton.propTypes = {
    indicatorId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
}
