import { render, waitFor, waitForElement } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CustomDataProvider, DataQuery } from '../react'
import { QueryRenderInput } from '../types'

const customData = {
    answer: 42,
}

describe('Testing custom data provider and useQuery hook', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it('Should render without failing', async () => {
        const queryClient = new QueryClient()
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.answer}</div>
            }
        )

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <CustomDataProvider data={customData}>
                    <DataQuery query={{ answer: { resource: 'answer' } }}>
                        {renderFunction}
                    </DataQuery>
                </CustomDataProvider>
            </QueryClientProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: undefined,
            engine: expect.any(Object),
            error: null,
            loading: true,
            refetch: expect.any(Function),
        })

        await waitFor(() => {
            // Fast forward through react-query's timeouts
            jest.runAllTimers()

            getByText(/data: /i)
        })

        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: customData,
            engine: expect.any(Object),
            error: null,
            loading: false,
            refetch: expect.any(Function),
        })
        expect(getByText(/data: /i)).toHaveTextContent(
            `data: ${customData.answer}`
        )
    })

    it('Should render an error', async () => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(jest.fn())
        const expectedError = new Error('Something went wrong')
        const queryClient = new QueryClient()
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
            <QueryClientProvider client={queryClient}>
                <CustomDataProvider data={data}>
                    <DataQuery query={{ test: { resource: 'test' } }}>
                        {renderFunction}
                    </DataQuery>
                </CustomDataProvider>
            </QueryClientProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: undefined,
            engine: expect.any(Object),
            error: null,
            loading: true,
            refetch: expect.any(Function),
        })

        await waitFor(() => {
            // Fast forward through react-query's timeouts
            jest.runAllTimers()

            getByText(/error: /i)
        })

        expect(renderFunction).toHaveBeenCalledTimes(5)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            data: undefined,
            engine: expect.any(Object),
            error: expectedError,
            loading: false,
            refetch: expect.any(Function),
        })
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })
})
