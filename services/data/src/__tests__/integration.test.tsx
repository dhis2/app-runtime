import { render, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider, setLogger } from 'react-query'
import { CustomDataProvider, DataQuery } from '../react'
import { QueryRenderInput } from '../types'

// eslint-disable-next-line react/display-name
const createWrapper = (mockData, queryClientOptions = {}) => ({
    children,
}: {
    children?: ReactNode
}) => {
    const queryClient = new QueryClient(queryClientOptions)

    return (
        <QueryClientProvider client={queryClient}>
            <CustomDataProvider data={mockData}>{children}</CustomDataProvider>
        </QueryClientProvider>
    )
}

beforeAll(() => {
    // Prevent the react-query logger from logging to the console
    setLogger({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    })
})

afterAll(() => {
    // Restore the original react-query logger
    setLogger(console)
})

describe('Testing custom data provider and useQuery hook', () => {
    it('Should render without failing', async () => {
        const data = {
            answer: 42,
        }
        const wrapper = createWrapper(data)
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

        expect(getByText(/data: /i)).toHaveTextContent(`data: ${data.answer}`)
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data,
            engine: expect.any(Object),
            error: undefined,
            loading: false,
            refetch: expect.any(Function),
        })
    })

    it('Should render an error', async () => {
        const expectedError = new Error('Something went wrong')
        const data = {
            test: () => {
                throw expectedError
            },
        }
        // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
        const wrapper = createWrapper(data, {
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        })
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
        expect(getByText(/error: /i)).toHaveTextContent(
            `error: ${expectedError.message}`
        )
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
