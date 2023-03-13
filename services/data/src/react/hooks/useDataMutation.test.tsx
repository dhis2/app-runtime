import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'
import { CreateMutation, UpdateMutation } from '../../engine/types/Mutation'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataEngine } from './useDataEngine'
import { useDataMutation } from './useDataMutation'

describe('useDataMutation', () => {
    it('should render without failing', async () => {
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: '?' },
        }
        const data = { answer: 42 }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitFor } = renderHook(
            () => useDataMutation(mutation),
            { wrapper }
        )

        const [mutate, beforeMutation] = result.current
        expect(beforeMutation).toMatchObject({
            loading: false,
            called: false,
        })

        act(() => {
            mutate()
        })

        await waitFor(() => {
            const [, duringMutation] = result.current
            expect(duringMutation).toMatchObject({
                loading: true,
                called: true,
            })
        })

        await waitFor(() => {
            const [, afterMutation] = result.current
            expect(afterMutation).toMatchObject({
                loading: false,
                called: true,
                data: 42,
            })
        })
    })

    it('should run immediately with lazy: false', async () => {
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: '?' },
        }
        const data = { answer: 42 }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitFor } = renderHook(
            () => useDataMutation(mutation, { lazy: false }),
            { wrapper }
        )

        const [, duringMutation] = result.current
        expect(duringMutation).toMatchObject({
            loading: true,
            called: true,
        })

        await waitFor(() => {
            const [, afterMutation] = result.current
            expect(afterMutation).toMatchObject({
                loading: false,
                called: true,
                data: 42,
            })
        })
    })

    it('should call onComplete on success', async () => {
        const onComplete = jest.fn()
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: '?' },
        }
        const data = { answer: 42 }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitFor } = renderHook(
            () => useDataMutation(mutation, { onComplete }),
            { wrapper }
        )

        expect(onComplete).toHaveBeenCalledTimes(0)
        const [mutate] = result.current
        act(() => {
            mutate()
        })

        await waitFor(() => {
            const [, state] = result.current
            expect(state).toMatchObject({
                loading: false,
                called: true,
                data: 42,
            })
            expect(onComplete).toHaveBeenCalledTimes(1)
            expect(onComplete).toHaveBeenLastCalledWith(42)
        })
    })

    it('should call onError on error', async () => {
        const error = new Error('Something went wrong')
        const onError = jest.fn()
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: 42 },
        }
        const data = {
            answer: () => {
                throw error
            },
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitFor } = renderHook(
            () => useDataMutation(mutation, { onError }),
            { wrapper }
        )

        expect(onError).toHaveBeenCalledTimes(0)
        const [mutate] = result.current

        act(() => {
            mutate()
        })

        await waitFor(() => {
            const [, state] = result.current
            expect(state).toMatchObject({
                loading: false,
                called: true,
                error,
            })
        })
        expect(onError).toHaveBeenCalledTimes(1)
        expect(onError).toHaveBeenLastCalledWith(error)
    })

    it('should resolve variables', async () => {
        const mutation: UpdateMutation = {
            type: 'update',
            resource: 'answer',
            id: ({ id }) => id,
            data: { answer: '?' },
        }
        const answerSpy = jest.fn(() => 42)
        const data = { answer: answerSpy }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitFor } = renderHook(
            () =>
                useDataMutation(mutation, {
                    lazy: false,
                    variables: { id: '1' },
                }),
            { wrapper }
        )

        await waitFor(() => {
            expect(answerSpy).toHaveBeenLastCalledWith(
                expect.any(String),
                expect.objectContaining({
                    id: '1',
                }),
                expect.any(Object)
            )
        })

        const [mutate] = result.current
        act(() => {
            mutate({ id: '2' })
        })

        await waitFor(() => {
            expect(answerSpy).toHaveBeenLastCalledWith(
                expect.any(String),
                expect.objectContaining({
                    id: '2',
                }),
                expect.any(Object)
            )
        })
    })

    it('should return a reference to the engine', async () => {
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: '?' },
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={{}}>{children}</CustomDataProvider>
        )

        const engineHook = renderHook(() => useDataEngine(), { wrapper })
        const mutationHook = renderHook(() => useDataMutation(mutation), {
            wrapper,
        })

        /**
         * Ideally we'd check referential equality here with .toBe, but since
         * both hooks run in a different context that doesn't work.
         */
        expect(mutationHook.result.current[1].engine).toStrictEqual(
            engineHook.result.current
        )
    })

    it('should return a stable mutate function', async () => {
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: '?' },
        }
        const data = { answer: 42 }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result } = renderHook(() => useDataMutation(mutation), {
            wrapper,
        })

        const [firstMutate] = result.current

        await act(async () => {
            await firstMutate({ variable: 'variable' })
        })

        const [secondMutate, state] = result.current
        expect(state).toMatchObject({
            loading: false,
            called: true,
        })
        expect(firstMutate).toBe(secondMutate)
    })

    it('should resolve with the data from mutate on success', async () => {
        const mutation: CreateMutation = {
            type: 'create',
            resource: 'answer',
            data: { answer: '?' },
        }
        const data = { answer: 42 }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )

        const { result, waitFor } = renderHook(
            () => useDataMutation(mutation),
            { wrapper }
        )

        let mutatePromise
        const [mutate] = result.current
        act(() => {
            mutatePromise = mutate()
        })

        await waitFor(() => {
            const [, state] = result.current
            expect(state).toMatchObject({
                loading: false,
                called: true,
                data: 42,
            })
            expect(mutatePromise).resolves.toBe(42)
        })
    })
})
