import React from 'react'
import { useDataMutation } from '@dhis2/app-runtime'

const mutation = ({ id }) => ({
    resource: 'indicators',
    id,
    type: 'delete',
})

export const DeleteButton = ({ indicatorId, onDelete }) => {
    const [mutate] = useDataMutation(mutation, {
        onCompleted: onDelete,
        variables: {
            id: indicatorId,
        },
    })

    return <button onClick={mutate}>Delete</button>
}
