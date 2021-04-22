import { renderHook, act } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider, setLogger } from 'react-query'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataQuery } from './useDataQuery'

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

describe('useDataQuery', () => {
    describe('parameters: onComplete', () => {
        it('Should call onComplete with the data after a successful fetch', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: false, onComplete, onError }),
                { wrapper }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(onComplete).toHaveBeenCalledWith({ x: 42 })
            expect(onError).not.toHaveBeenCalled()
            expect(result.current).toMatchObject({
                data: { x: 42 },
            })
        })
    })

    describe('parameters: onError', () => {
        it('Should call onError with the error after a fetch error', async () => {
            // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }

            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData, queryClientOptions)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { onError, onComplete }),
                { wrapper }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(onError).toHaveBeenCalledWith(expectedError)
            expect(onComplete).not.toHaveBeenCalled()
            expect(result.current).toMatchObject({
                error: expectedError,
            })
        })
    })

    describe('parameters: variables', () => {
        it('Should ignore new variables from rerenders', async () => {
            const one = 'one'
            const two = 'two'
            const resultOne = 1
            const resultTwo = 2
            const query = {
                x: { resource: 'answer', id: ({ id }) => id },
            }
            const mockSpy = jest.fn((_, { id }) => {
                switch (id) {
                    case one:
                        return resultOne
                    case two:
                        return resultTwo
                }
            })
            const mockData = {
                answer: mockSpy,
            }
            const wrapper = createWrapper(mockData)
            const initialProps = {
                query,
                options: { variables: { id: one } },
            }

            const { result, waitForNextUpdate, rerender } = renderHook(
                props => useDataQuery(props.query, props.options),
                {
                    wrapper,
                    initialProps,
                }
            )

            expect(mockSpy).toHaveBeenCalledTimes(1)
            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                data: { x: resultOne },
            })

            act(() => {
                const newProps = {
                    query,
                    options: {
                        variables: { id: two },
                    },
                }

                rerender(newProps)
            })

            expect(mockSpy).toHaveBeenCalledTimes(1)
            expect(result.current).toMatchObject({
                data: { x: resultOne },
            })
        })
    })

    describe('parameters: lazy', () => {
        it('Should be false by default', async () => {
            const query = { x: { resource: 'answer' } }
            const mockSpy = jest.fn(() => 42)
            const mockData = { answer: mockSpy }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                { wrapper }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(mockSpy).toHaveBeenCalledTimes(1)
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
        })
    })

    describe('internal: caching', () => {
        it('Should return stale data initially on refetch', async () => {
            const answers = [42, 43]
            const mockSpy = jest.fn(() => answers.shift())
            const mockData = {
                answer: mockSpy,
            }
            const query = { x: { resource: 'answer' } }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                {
                    wrapper,
                }
            )

            expect(mockSpy).toHaveBeenCalledTimes(1)
            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })

            act(() => {
                result.current.refetch()
            })

            expect(mockSpy).toHaveBeenCalledTimes(2)
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })

            await waitForNextUpdate()

            expect(mockSpy).toHaveBeenCalledTimes(2)
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 43 },
            })
        })

        it('Should return data from the cache if it is not stale', async () => {
            // Keep cached data forever, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        staleTime: Infinity,
                    },
                },
            }
            const answers = [42, 43]
            const mockSpy = jest.fn(() => answers.shift())
            const mockData = {
                answer: mockSpy,
            }
            const query = { x: { resource: 'answer' } }
            const wrapper = createWrapper(mockData, queryClientOptions)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                {
                    wrapper,
                }
            )

            expect(mockSpy).toHaveBeenCalledTimes(1)
            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            // Now the cache will contain a value for 'answer' without variables
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })

            act(() => {
                // Add a variable to the request to ensure a different cache key
                // eslint-disable-next-line
                // @ts-ignore
                result.current.refetch({ one: 1 })
            })

            expect(mockSpy).toHaveBeenCalledTimes(2)
            expect(result.current).toMatchObject({
                loading: true,
            })

            await waitForNextUpdate()

            // Now the cache will contain a value for 'answer' with and without variables
            expect(result.current).toMatchObject({
                loading: false,
                data: { x: 43 },
            })

            act(() => {
                // Request the resource without variables again
                // eslint-disable-next-line
                // @ts-ignore
                result.current.refetch({ one: undefined })
            })

            // This should return the resource from the cache without fetching
            expect(mockSpy).toHaveBeenCalledTimes(2)
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
        })
    })

    describe('return values: data', () => {
        it('Should return the data for a single resource query on success', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                {
                    wrapper,
                }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
        })

        it('Should return the data for a multiple resource query on success', async () => {
            const query = {
                x: { resource: 'answer' },
                y: { resource: 'opposite' },
            }
            const mockData = { answer: 42, opposite: 24 }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                {
                    wrapper,
                }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42, y: 24 },
            })
        })
    })

    describe('return values: error', () => {
        it('Should return errors it encounters for a single resource query', async () => {
            // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }

            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData, queryClientOptions)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                {
                    wrapper,
                }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                error: expectedError,
            })
        })

        it('Should return errors it encounters for multiple resource queries', async () => {
            // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }

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
            const wrapper = createWrapper(mockData, queryClientOptions)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query),
                {
                    wrapper,
                }
            )

            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                error: expectedError,
            })
        })
    })

    describe('return values: refetch', () => {
        it('Should not fetch until refetch has been called if lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockSpy = jest.fn(() => 42)
            const mockData = { answer: mockSpy }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: true }),
                { wrapper }
            )

            expect(mockSpy).toHaveBeenCalledTimes(0)
            expect(result.current).toMatchObject({
                loading: false,
                called: false,
            })

            act(() => {
                result.current.refetch()
            })

            expect(mockSpy).toHaveBeenCalledTimes(1)
            expect(result.current).toMatchObject({
                loading: true,
                called: true,
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
        })

        it('Should call onComplete after a successful refetch', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: true, onComplete, onError }),
                { wrapper }
            )

            act(() => {
                result.current.refetch()
            })

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
            expect(onComplete).toHaveBeenCalledWith({ x: 42 })
            expect(onError).not.toHaveBeenCalled()
        })

        it('Should call onError after a failed refetch', async () => {
            // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }

            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData, queryClientOptions)
            const onComplete = jest.fn()
            const onError = jest.fn()

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: true, onComplete, onError }),
                { wrapper }
            )

            act(() => {
                result.current.refetch()
            })

            await waitForNextUpdate()

            expect(onError).toHaveBeenCalledWith(expectedError)
            expect(onComplete).not.toHaveBeenCalled()
            expect(result.current).toMatchObject({
                error: expectedError,
            })
        })

        it('Should return a promise that resolves with the data on success when refetching and lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: true }),
                { wrapper }
            )

            let ourPromise
            act(() => {
                // This refetch will trigger our own refetch logic
                ourPromise = result.current.refetch()
            })

            await waitForNextUpdate()

            expect(ourPromise).resolves.toEqual({ x: 42 })
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
        })

        it('Should return a promise that resolves with the data on success when refetching and not lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: false }),
                { wrapper }
            )

            let reactQueryPromise
            act(() => {
                // This refetch will trigger react query's refetch logic
                reactQueryPromise = result.current.refetch()
            })

            await waitForNextUpdate()

            expect(reactQueryPromise).resolves.toEqual({ x: 42 })
            expect(result.current).toMatchObject({
                loading: false,
                called: true,
                data: { x: 42 },
            })
        })

        it('Should return a promise that does not reject on errors when refetching and lazy', async () => {
            // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }

            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData, queryClientOptions)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: true }),
                { wrapper }
            )

            let ourPromise
            act(() => {
                // This refetch will trigger our own refetch logic
                ourPromise = result.current.refetch()
            })

            await waitForNextUpdate()

            expect(ourPromise).resolves.toBeUndefined()
            expect(result.current).toMatchObject({
                error: expectedError,
            })
        })

        it('Should return a promise that does not reject on errors when refetching and not lazy', async () => {
            // Disable automatic retries, see: https://react-query.tanstack.com/reference/useQuery
            const queryClientOptions = {
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }

            const expectedError = new Error('Something went wrong')
            const query = { x: { resource: 'answer' } }
            const mockData = {
                answer: () => {
                    throw expectedError
                },
            }
            const wrapper = createWrapper(mockData, queryClientOptions)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { lazy: false }),
                { wrapper }
            )

            let reactQueryPromise
            act(() => {
                // This refetch will trigger react query's refetch logic
                reactQueryPromise = result.current.refetch()
            })

            await waitForNextUpdate()

            expect(reactQueryPromise).resolves.toBeUndefined()
            expect(result.current).toMatchObject({
                error: expectedError,
            })
        })

        it('Should accept new variables from refetch', async () => {
            const one = 'one'
            const two = 'two'
            const resultOne = 1
            const resultTwo = 2
            const query = {
                x: { resource: 'answer', id: ({ id }) => id },
            }
            const mockSpy = jest.fn((_, { id }) => {
                switch (id) {
                    case one:
                        return resultOne
                    case two:
                        return resultTwo
                }
            })
            const mockData = {
                answer: mockSpy,
            }
            const wrapper = createWrapper(mockData)
            const initialProps = {
                query,
                options: { variables: { id: one } },
            }

            const { result, waitForNextUpdate } = renderHook(
                props => useDataQuery(props.query, props.options),
                {
                    wrapper,
                    initialProps,
                }
            )

            await waitForNextUpdate()

            expect(result.current).toMatchObject({
                data: { x: resultOne },
            })

            act(() => {
                // eslint-disable-next-line
                // @ts-ignore
                result.current.refetch({ id: two })
            })

            await waitForNextUpdate()

            expect(mockSpy).toHaveBeenCalledTimes(2)
            expect(result.current).toMatchObject({
                data: { x: resultTwo },
            })
        })

        it('Should merge new variables from refetch with the existing variables', async () => {
            const initialVariables = { one: 1, two: 2, three: 3 }
            const newVariables = { two: 1, three: 1 }
            const query = {
                x: {
                    resource: 'answer',
                    params: ({ one, two, three }) => ({ one, two, three }),
                },
            }
            const mockSpy = jest.fn(() => 42)
            const mockData = {
                answer: mockSpy,
            }
            const wrapper = createWrapper(mockData)

            const { result, waitForNextUpdate } = renderHook(
                () => useDataQuery(query, { variables: initialVariables }),
                { wrapper }
            )

            await waitForNextUpdate()

            // eslint-disable-next-line
            // @ts-ignore
            const { params: firstParams } = mockSpy.mock.calls[0][1]
            expect(firstParams).toMatchObject(initialVariables)

            act(() => {
                // eslint-disable-next-line
                // @ts-ignore
                result.current.refetch(newVariables)
            })

            await waitForNextUpdate()

            // eslint-disable-next-line
            // @ts-ignore
            const { params: secondParams } = mockSpy.mock.calls[1][1]
            expect(secondParams).toMatchObject({
                ...initialVariables,
                ...newVariables,
            })
        })
    })
})
