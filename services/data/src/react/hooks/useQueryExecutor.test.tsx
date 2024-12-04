import { renderHook, act, waitFor } from '@testing-library/react'
import { useQueryExecutor } from './useQueryExecutor'

const testError = new Error('TEST ERROR')
let theSignal: AbortSignal | undefined
const execute = jest.fn(async ({ signal }) => {
    theSignal = signal
    return 42
})
const failingExecute = jest.fn(async () => {
    throw testError
})

describe('useQueryExecutor', () => {
    afterEach(() => {
        jest.clearAllMocks()
        theSignal = undefined
    })
    it('When not immediate, should start with called false and loading false', () => {
        const { result } = renderHook(() =>
            useQueryExecutor({
                execute,
                immediate: false,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: false,
            loading: false,
        })
    })

    it('When immediate, should start with called true and loading true', async () => {
        const { result } = renderHook(() =>
            useQueryExecutor({
                execute,
                immediate: true,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })

        await waitFor(() => {
            expect(result.current).toMatchObject({
                called: true,
                loading: false,
                data: 42,
            })
        })
    })

    it('Should start when refetch called (if not immediate)', async () => {
        const { result } = renderHook(() =>
            useQueryExecutor({
                execute,
                immediate: false,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: false,
            loading: false,
        })

        act(() => {
            result.current.refetch()
        })

        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })

        await waitFor(() => {
            expect(result.current).toMatchObject({
                called: true,
                loading: false,
                data: 42,
            })
        })
    })

    it('Should report an error when execute fails', async () => {
        const { result } = renderHook(() =>
            useQueryExecutor({
                execute: failingExecute,
                immediate: false,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: false,
            loading: false,
        })

        act(() => {
            result.current.refetch()
        })

        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })

        await waitFor(() => {
            expect(result.current).toMatchObject({
                called: true,
                loading: false,
                error: testError,
            })
        })
    })

    it("Shouldn't abort+refetch when inputs change on subsequent renders", async () => {
        const { result, rerender } = renderHook(
            ({ onComplete }) =>
                useQueryExecutor({
                    execute,
                    immediate: true,
                    singular: true,
                    variables: {},
                    onComplete,
                }),
            {
                initialProps: { onComplete: () => null },
            }
        )

        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })

        rerender({ onComplete: () => null })

        await waitFor(() => {
            expect(result.current).toMatchObject({
                called: true,
                loading: false,
                data: 42,
            })

            expect(theSignal && theSignal.aborted).toBe(false)
            expect(execute).toHaveBeenCalledTimes(1)
        })
    })

    it('Should respect abort signal', async () => {
        const { result } = renderHook(() =>
            useQueryExecutor({
                execute,
                immediate: false,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: false,
            loading: false,
        })

        act(() => {
            result.current.refetch()
        })

        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })

        act(() => {
            result.current.abort()
        })

        expect(theSignal && theSignal.aborted).toBe(true)

        expect(result.current).toMatchObject({
            called: true,
            loading: false,
            error: { type: 'aborted', message: 'Aborted' },
        })
    })
})
