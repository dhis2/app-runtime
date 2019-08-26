import * as React from 'react';
import { storiesOf } from '@storybook/react';

import {
    CustomDataProvider,
    useDataQuery,
} from '../src/'

const Test = () => {
    const query = {
        systemInfo: { resource: 'system/info' },
    }

    const { loading, error, data } = useDataQuery(query)

    if (loading) return <div>Loading...</div>
    if (error) return <div>error: {error}</div>

    return (
        <div>
            Query:<br />
            <code><pre>
                {JSON.stringify(query, null, 2)}
            </pre></code>

            <hr />

            Data:<br />
            <code><pre>
                {JSON.stringify(data, null, 2)}
            </pre></code>
        </div>
    )
}

storiesOf('useDataQuery', module)
    .add('Successful loading', () => {
        const customData = {
            'system/info': {
                systemName: 'Foobar',
                contextPath: 'https://play.dhis2.org/2.32.0',
            },
        }

        return (
            <CustomDataProvider data={customData}>
                <Test />
            </CustomDataProvider>
        )
    })
    .add('Loading for 3s', () => {
        const customData = {
            'system/info': new Promise(resolve => {
                setTimeout(
                    () => resolve({
                        systemName: 'Foobar',
                        contextPath: 'https://play.dhis2.org/2.32.0',
                    }),
                    3 * 1000,
                )
            }),
        }

        return (
            <CustomDataProvider data={customData}>
                <Test />
            </CustomDataProvider>
        )
    })
    .add('Error', () => {
        const customData = {
            'system/info': new Promise((resolve, reject) => {
                reject('Something has gone terribly wrong')
            }),
        }

        return (
            <CustomDataProvider data={customData}>
                <Test />
            </CustomDataProvider>
        )
    })
