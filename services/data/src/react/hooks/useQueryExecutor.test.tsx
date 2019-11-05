import { renderHook, act } from '@testing-library/react-hooks'
import { useQueryExecutor } from './useQueryExecutor'

const testError = new Error('TEST ERROR')
const execute = jest.fn(async () => 42)
const failingExecute = jest.fn(async () => {
    throw testError
})

describe('useQueryExecutor', () => {
    afterEach(() => {
        jest.clearAllMocks()
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
        const { result, waitForNextUpdate } = renderHook(() =>
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

        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: false,
            data: 42,
        })
    })

    it('Should start when refetch called (if not immediate)', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
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

        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: false,
            data: 42,
        })
    })

    it('Should report an error when execute fails', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
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

        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: false,
            error: testError,
        })
    })

    it("Shouldn't abort+refetch when inputs change on subsequent renders", async () => {
        const { result, waitForNextUpdate, rerender } = renderHook(
            ({ onComplete }) =>
                useQueryExecutor({
                    execute,
                    immediate: true,
                    singular: true,
                    variables: {},
                    onComplete,
                }),
            {
                initialProps: { onComplete: () => {} },
            }
        )

        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })

        rerender({ onComplete: () => {} })

        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: false,
            data: 42,
        })

        expect(execute).toHaveBeenCalledTimes(1)
    })

    // it('Should respect abort signal', async () => {
    //     const { result, waitForNextUpdate } = renderHook(() =>
    //         useQueryExecutor({
    //             execute,
    //             immediate: false,
    //             singular: true,
    //             variables: {},
    //         })
    //     )

    //     expect(result.current).toMatchObject({
    //         called: false,
    //         loading: false,
    //     })

    //     act(() => {
    //         result.current.refetch()
    //         result.current.abort()
    //     })

    //     expect(result.current).toMatchObject({
    //         called: true,
    //         loading: true,
    //     })

    //     await waitForNextUpdate()
    //     expect(result.current).toMatchObject({
    //         called: true,
    //         loading: false,
    //         error: testError,
    //     })
    // })
})
