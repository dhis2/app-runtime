import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataQuery } from './useDataQuery'

// eslint-disable-next-line react/display-name
const createWrapper = mockData => ({ children }: { children?: ReactNode }) => {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <CustomDataProvider data={mockData}>{children}</CustomDataProvider>
        </QueryClientProvider>
    )
}

describe('useDataQuery', () => {
    const originalError = console.error

    beforeEach(() => {
        jest.useFakeTimers()
    })

    beforeAll(() => {
        // TODO: suppresses the act warning, we should address this
        console.error = jest.fn()
    })

    afterAll(() => {
        console.error = originalError
    })

    describe('Loading', () => {
        it('Should set initial loading state to true if not lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)

            const { result } = renderHook(
                () => useDataQuery(query, { lazy: false }),
                { wrapper }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })
        })
    })

    describe('Data', () => {
        it('Should return the data on success', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)

            const { result, waitFor } = renderHook(() => useDataQuery(query), {
                wrapper,
            })

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitFor(() => {
                // Fast forward through react-query's timeouts
                jest.runAllTimers()

                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    data: { x: 42 },
                })
            })
        })
    })

    describe('Errors', () => {
        it('Should return any errors it encounters', async () => {
            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData)

            const { result, waitFor } = renderHook(() => useDataQuery(query), {
                wrapper,
            })

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitFor(() => {
                // Fast forward through react-query's automatic retries on errors
                jest.runAllTimers()

                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    error: expectedError,
                })
            })
        })
    })

    describe('Lazy queries', () => {
        it('Should not fetch until refetch has been called if lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)

            const { result, waitFor } = renderHook(
                () => useDataQuery(query, { lazy: true }),
                { wrapper }
            )

            expect(result.current).toMatchObject({
                loading: false,
                called: false,
            })

            result.current.refetch()

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitFor(() => {
                // Fast forward through react-query's timeouts
                jest.runAllTimers()

                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    data: { x: 42 },
                })
            })
        })
    })
})
