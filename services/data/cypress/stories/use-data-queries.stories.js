import { useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect } from 'react'

import { providerDecorator } from './common'

export default { title: 'Use Data Query', decorators: [providerDecorator] }

window.loading = undefined
window.error = undefined
window.data = undefined

const QueryComponent = () => {
    const { loading, error, data } = useDataQuery({
        me: { resource: 'me' },
    })

    useEffect(() => {
        window.loading = loading
        window.error = error
        window.data = data
    }, [loading, error, data])

    const className = loading ? 'loading' : error ? 'error' : 'data'
    return <span className={className} />
}

export const Query = () => <QueryComponent />
