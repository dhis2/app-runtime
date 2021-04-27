import { render, waitFor, waitForElement } from '@testing-library/react'
import React from 'react'
import { cache, SWRConfig } from 'swr'
import { CustomDataProvider, DataQuery } from '../react'
import { QueryRenderInput } from '../types'

const customData = {
    answer: 42,
}

describe('Testing custom data provider and useQuery hook', () => {
    afterEach(async () => {
        await waitFor(() => cache.clear())
    })

    it('Should render without failing', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.answer}</div>
            }
        )

        const { getByText } = render(
            <SWRConfig value={{ dedupingInterval: 0 }}>
                <CustomDataProvider data={customData}>
                    <DataQuery query={{ answer: { resource: 'answer' } }}>
                        {renderFunction}
                    </DataQuery>
                </CustomDataProvider>
            </SWRConfig>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: undefined,
            engine: expect.any(Object),
            error: undefined,
            loading: true,
            refetch: expect.any(Function),
        })

        await waitFor(() => {
            getByText(/data: /i)
        })

        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: customData,
            engine: expect.any(Object),
            error: undefined,
            loading: false,
            refetch: expect.any(Function),
        })
        expect(getByText(/data: /i)).toHaveTextContent(
            `data: ${customData.answer}`
        )
    })

    it('Should render an error', async () => {
        const expectedError = new Error('Something went wrong')
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.test}</div>
            }
        )
        const data = {
            test: () => {
                throw expectedError
            },
        }

        const { getByText } = render(
            <SWRConfig value={{ dedupingInterval: 0 }}>
                <CustomDataProvider data={data}>
                    <DataQuery query={{ test: { resource: 'test' } }}>
                        {renderFunction}
                    </DataQuery>
                </CustomDataProvider>
            </SWRConfig>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: undefined,
            engine: expect.any(Object),
            error: undefined,
            loading: true,
            refetch: expect.any(Function),
        })

        await waitFor(() => {
            getByText(/error: /i)
        })

        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: undefined,
            engine: expect.any(Object),
            error: expectedError,
            loading: false,
            refetch: expect.any(Function),
        })
    })
})
