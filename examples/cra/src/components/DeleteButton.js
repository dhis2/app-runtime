import React from 'react'
import { useDataMutation } from '@dhis2/app-runtime'

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
