import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { cache, SWRConfig } from 'swr'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataQuery } from './useDataQuery'

describe('useDataQuery', () => {
    const originalError = console.error

    afterEach(async () => {
        await waitFor(() => cache.clear())
        console.error = originalError
    })

    describe('Loading', () => {
        it('Should set initial loading state to true if not lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = ({ children }: { children?: ReactNode }) => {
                return (
                    <SWRConfig value={{ dedupingInterval: 0 }}>
                        <CustomDataProvider data={mockData}>
                            {children}
                        </CustomDataProvider>
                    </SWRConfig>
                )
            }

            // TODO: suppresses the act warning, we should address this
            console.error = jest.fn()

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
            const wrapper = ({ children }: { children?: ReactNode }) => {
                return (
                    <SWRConfig value={{ dedupingInterval: 0 }}>
                        <CustomDataProvider data={mockData}>
                            {children}
                        </CustomDataProvider>
                    </SWRConfig>
                )
            }

            // TODO: suppresses the act warning, we should address this
            console.error = jest.fn()

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
            const wrapper = ({ children }: { children?: ReactNode }) => {
                return (
                    <SWRConfig value={{ dedupingInterval: 0 }}>
                        <CustomDataProvider data={mockData}>
                            {children}
                        </CustomDataProvider>
                    </SWRConfig>
                )
            }

            // TODO: suppresses the act warning, we should address this
            console.error = jest.fn()

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
                    error: expectedError,
                })
            })
        })
    })

    describe('Lazy queries', () => {
        it('Should not fetch until refetch has been called if lazy', async () => {
            const query = { x: { resource: 'answer' } }
            const mockData = { answer: 42 }
            const wrapper = ({ children }: { children?: ReactNode }) => {
                return (
                    <SWRConfig value={{ dedupingInterval: 0 }}>
                        <CustomDataProvider data={mockData}>
                            {children}
                        </CustomDataProvider>
                    </SWRConfig>
                )
            }

            // TODO: suppresses the act warning, we should address this
            console.error = jest.fn()

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
    })
})
