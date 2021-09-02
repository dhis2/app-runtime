import { render, waitFor } from '@testing-library/react'
import * as React from 'react'
import { CustomDataProvider, DataQuery } from '../react'
import { QueryRenderInput } from '../types'

describe('Testing custom data provider and useQuery hook', () => {
    it('Should render without failing', async () => {
        const data = {
            answer: 42,
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.answer}</div>
            }
        )

        const { getByText } = render(
            <DataQuery query={{ answer: { resource: 'answer' } }}>
                {renderFunction}
            </DataQuery>,
            { wrapper }
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith(
            expect.objectContaining({
                called: true,
                loading: true,
            })
        )

        await waitFor(() => {
            getByText(/data: /i)
        })

        expect(getByText(/data: /i)).toHaveTextContent(`data: ${data.answer}`)
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith(
            expect.objectContaining({
                called: true,
                loading: false,
                data,
            })
        )
    })

    it('Should render an error', async () => {
        const expectedError = new Error('Something went wrong')
        const data = {
            test: () => {
                throw expectedError
            },
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.test}</div>
            }
        )

        const { getByText } = render(
            <DataQuery query={{ test: { resource: 'test' } }}>
                {renderFunction}
            </DataQuery>,
            { wrapper }
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith(
            expect.objectContaining({
                called: true,
                loading: true,
            })
        )

        await waitFor(() => {
            getByText(/error: /i)
        })

        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(getByText(/error: /i)).toHaveTextContent(
            `error: ${expectedError.message}`
        )
        expect(renderFunction).toHaveBeenLastCalledWith(
            expect.objectContaining({
                called: true,
                loading: false,
                error: expectedError,
            })
        )
    })
})
