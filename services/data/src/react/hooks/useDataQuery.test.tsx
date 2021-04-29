import { waitFor } from '@testing-library/react'
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

    describe('onComplete', () => {
        it('Should call onComplete with the data after a successful fetch', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result } = renderHook(
                () => useDataQuery(query, { lazy: false, onComplete, onError }),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current).toMatchObject({
                    data: { x: 42 },
                })
                expect(onComplete).toHaveBeenCalledWith({ x: 42 })
                expect(onError).not.toHaveBeenCalled()
            })
        })
    })

    describe('onError', () => {
        it('Should call onError with the error after an error', async () => {
            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitFor } = renderHook(
                () => useDataQuery(query, { onError, onComplete }),
                { wrapper }
            )

            await waitFor(() => {
                // Fast forward through react-query's automatic retries on errors
                jest.runAllTimers()

                expect(result.current).toMatchObject({
                    error: expectedError,
                })
                expect(onError).toHaveBeenCalledWith(expectedError)
                expect(onComplete).not.toHaveBeenCalled()
            })
        })
    })

    describe('Data', () => {
        it('Should return the data for a single resource query on success', async () => {
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
                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    data: { x: 42 },
                })
            })
        })

        it('Should return the data for a multiple resource query on success', async () => {
            const query = {
                x: { resource: 'answer' },
                y: { resource: 'opposite' },
            }
            const mockData = { answer: 42, opposite: 24 }
            const wrapper = createWrapper(mockData)

            const { result, waitFor } = renderHook(() => useDataQuery(query), {
                wrapper,
            })

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitFor(() => {
                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    data: { x: 42, y: 24 },
                })
            })
        })
    })

    describe('Errors', () => {
        it('Should return errors it encounters for a single resource query', async () => {
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

        it('Should return errors it encounters for multiple resource queries', async () => {
            const expectedError = new Error('Something went wrong')
            const query = {
                x: { resource: 'answer' },
                y: { resource: 'opposite' },
            }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
                opposite: 24,
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
                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    data: { x: 42 },
                })
            })
        })

        it('Should call onComplete after a successful refetch', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitFor } = renderHook(
                () => useDataQuery(query, { lazy: true, onComplete, onError }),
                { wrapper }
            )

            result.current.refetch()

            await waitFor(() => {
                expect(result.current).toMatchObject({
                    loading: false,
                    called: true,
                    data: { x: 42 },
                })
                expect(onComplete).toHaveBeenCalledWith({ x: 42 })
                expect(onError).not.toHaveBeenCalled()
            })
        })

        it('Should call onError after a failed refetch', async () => {
            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitFor } = renderHook(
                () => useDataQuery(query, { lazy: true, onComplete, onError }),
                { wrapper }
            )

            result.current.refetch()

            await waitFor(() => {
                // Fast forward through react-query's automatic retries on errors
                jest.runAllTimers()

                expect(result.current).toMatchObject({
                    error: expectedError,
                })
                expect(onError).toHaveBeenCalledWith(expectedError)
                expect(onComplete).not.toHaveBeenCalled()
            })
        })
    })

    describe('Variables', () => {
        it('Should process a query with variables correctly', async () => {
            const expectedId = 'id'
            const expectedData = 42

            // Set up a query that accepts an id as a variable
            const query = {
                x: { resource: 'answer', id: ({ id }) => id },
            }

            // Only return the data if it matches the expected id
            const mockData = {
                answer: (_, { id }) => {
                    if (id === expectedId) {
                        return expectedData
                    }
                },
            }
            const wrapper = createWrapper(mockData)

            const { result, waitFor } = renderHook(
                // Pass the id as a variable
                () => useDataQuery(query, { variables: { id: expectedId } }),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current).toMatchObject({
                    data: { x: expectedData },
                })
            })
        })

        it('Should correctly refetch a query with new variables', async () => {
            const wrongId = 'wrongId'
            const expectedId = 'expectedId'
            const wrongData = 24
            const expectedData = 42

            // Set up a query that accepts an id as a variable
            const query = {
                x: { resource: 'answer', id: ({ id }) => id },
            }

            // Only return the correct data if it matches the expected id
            const mockData = {
                answer: (_, { id }) => {
                    if (id === expectedId) {
                        return expectedData
                    } else if (id === wrongId) {
                        return wrongData
                    }
                },
            }
            const wrapper = createWrapper(mockData)

            const { result, waitFor } = renderHook(
                // Pass the wrong id initially
                // eslint-disable-next-line
                // @ts-ignore
                () => useDataQuery(query, { variables: { id: wrongId } }),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current).toMatchObject({
                    data: { x: wrongData },
                })
            })

            // eslint-disable-next-line
            // @ts-ignore
            result.current.refetch({ id: expectedId })

            await waitFor(() => {
                expect(result.current).toMatchObject({
                    data: { x: expectedData },
                })
            })
        })
    })
})
