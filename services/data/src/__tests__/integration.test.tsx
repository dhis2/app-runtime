import { render, waitFor, act } from '@testing-library/react'
import React from 'react'
import {
    FetchType,
    DataEngineLinkExecuteOptions,
    ResolvedResourceQuery,
} from '../engine'
import { CustomDataProvider, DataQuery } from '../react'
import { QueryRenderInput } from '../types'

const customData = {
    answer: 42,
}

describe('Testing custom data provider and useQuery hook', () => {
    it('Should render without failing', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.answer}</div>
            }
        )

        const { getByText } = render(
            <CustomDataProvider data={customData}>
                <DataQuery query={{ answer: { resource: 'answer' } }}>
                    {renderFunction}
                </DataQuery>
            </CustomDataProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            loading: true,
            refetch: expect.any(Function),
            engine: expect.any(Object),
        })
        await waitFor(() => getByText(/data: /i))
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            loading: false,
            data: customData,
            refetch: expect.any(Function),
            engine: expect.any(Object),
        })

        expect(getByText(/data: /i)).toHaveTextContent(
            `data: ${customData.answer}`
        )
    })

    it('Should render an error', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.test}</div>
            }
        )

        const { getByText } = render(
            <CustomDataProvider data={customData}>
                <DataQuery query={{ test: { resource: 'test' } }}>
                    {renderFunction}
                </DataQuery>
            </CustomDataProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            called: true,
            loading: true,
            refetch: expect.any(Function),
            engine: expect.any(Object),
        })
        await waitFor(() => getByText(/error: /i))
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(String(renderFunction.mock.calls[1][0].error)).toBe(
            'Error: No data provided for resource type test!'
        )
        // expect(getByText(/data: /i)).toHaveTextContent(
        //     `data: ${customData.answer}`
        // )
    })

    it('Should abort the fetch when unmounted', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.test}</div>
            }
        )

        let signal: AbortSignal | null | undefined
        const mockData = {
            factory: jest.fn(
                async (
                    type: FetchType,
                    _: ResolvedResourceQuery,
                    options?: DataEngineLinkExecuteOptions
                ) => {
                    if (options && options.signal && !signal) {
                        signal = options.signal
                    }
                    return 'done'
                }
            ),
        }

        const { unmount } = render(
            <CustomDataProvider data={mockData}>
                <DataQuery query={{ test: { resource: 'factory' } }}>
                    {renderFunction}
                </DataQuery>
            </CustomDataProvider>
        )

        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(mockData.factory).toHaveBeenCalledTimes(1)
        act(() => {
            unmount()
        })
        expect(signal && signal.aborted).toBe(true)
    })

    it('Should abort the fetch when refetching', async () => {
        let refetch: any
        const renderFunction = jest.fn(
            ({ loading, error, data, refetch: _refetch }: QueryRenderInput) => {
                refetch = _refetch
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data && data.test}</div>
            }
        )

        let signal: any
        const mockData = {
            factory: jest.fn(
                async (
                    type: FetchType,
                    q: ResolvedResourceQuery,
                    options?: DataEngineLinkExecuteOptions
                ) => {
                    if (options && options.signal && !signal) {
                        signal = options.signal
                    }
                    return 'test'
                }
            ),
        }

        const { getByText } = render(
            <CustomDataProvider data={mockData}>
                <DataQuery query={{ test: { resource: 'factory' } }}>
                    {renderFunction}
                </DataQuery>
            </CustomDataProvider>
        )

        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(mockData.factory).toHaveBeenCalledTimes(1)

        expect(signal.aborted).toBe(false)
        expect(refetch).not.toBeUndefined()
        act(() => {
            refetch()
        })

        expect(signal.aborted).toBe(true)
        await waitFor(() => getByText(/data: /i))

        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(mockData.factory).toHaveBeenCalledTimes(2)
    })
})
