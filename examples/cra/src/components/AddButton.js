import React from 'react'
import { useDataMutation } from '@dhis2/app-runtime'

const mutation = {
    resource: 'indicators',
    type: 'create',
    data: ({ name }) => ({
        name,
        shortName: name,
        indicatorType: {
            id: 'bWuNrMHEoZ0',
        },
        numerator: '#{fbfJHSPpUQD}',
        denominator: '#{h0xKKjijTdI}',
    }),
}

export const AddButton = ({ onCreate }) => {
    const [mutate] = useDataMutation(mutation, {
        onComplete: onCreate,
        variables: {
            name: 'A NEW INDICATOR',
        },
    })

    return (
        <button
            onClick={() => {
                mutate()
            }}
            style={{ margin: 10 }}
        >
            + Add Indicator
        </button>
    )
}
