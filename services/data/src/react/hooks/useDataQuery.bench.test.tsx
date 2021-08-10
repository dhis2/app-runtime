import { renderHook, act } from '@testing-library/react-hooks'
import { measure, performance } from 'jest-measure'
import * as React from 'react'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataQuery } from './useDataQuery'

describe('useDataQuery', () => {
    measure('update variables', async () => {
        const variables = { one: 1, two: 2, three: 3 }
        const query = {
            x: {
                resource: 'answer',
                params: ({ one, two, three }) => ({ one, two, three }),
            },
        }
        const data = { answer: 42 }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitForNextUpdate } = renderHook(
            () => useDataQuery(query, { variables }),
            { wrapper }
        )

        await waitForNextUpdate()

        performance.mark('ready')

        // Update twice
        act(() => {
            result.current.refetch(variables)
        })

        await waitForNextUpdate()

        act(() => {
            result.current.refetch(variables)
        })

        await waitForNextUpdate()

        performance.mark('updated')
        performance.measure('update', 'ready', 'updated')
    })
})
