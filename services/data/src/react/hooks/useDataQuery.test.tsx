import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'
import { ReactNode } from 'react'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataQuery } from './useDataQuery'

let answer = 42
const customData = {
    answer: () => Promise.resolve(answer++),
}

const wrapper = ({ children }: { children?: ReactNode }) => (
    <CustomDataProvider data={customData}>{children}</CustomDataProvider>
)

const answerQuery = {
    resource: 'answer',
    params: jest.fn(() => ({})),
}

const query = { x: answerQuery }

describe('useDataQuery', () => {
    const originalError = console.error

    beforeEach(() => {
        answer = 42
        console.error = jest.fn()
    })

    afterEach(() => {
        console.error = originalError
        answerQuery.params.mockClear()
    })

    it('Should render without failing', async () => {
        let hookState: any

        act(() => {
            hookState = renderHook(() => useDataQuery(query), {
                wrapper,
            })
        })

        expect(hookState.result.current).toMatchObject({ loading: true })
    })

    it('Should lazily await a refetch call', async () => {
        let hookState: any

        act(() => {
            hookState = renderHook(() => useDataQuery(query, { lazy: true }), {
                wrapper,
            })
        })

        expect(hookState.result.current).toMatchObject({ loading: false })

        act(() => {
            hookState.result.current.refetch()
        })

        expect(hookState.result.current).toMatchObject({ loading: true })

        await hookState.waitForNextUpdate()

        expect(hookState.result.current).toMatchObject({
            loading: false,
            data: { x: 42 },
        })
    })

    it('should', async () => {
        let hookState: any
        const queries = [{ q1: answerQuery }, { q2: answerQuery }]

        act(() => {
            hookState = renderHook(() => useDataQuery(queries), {
                wrapper,
            })
        })

        let state = hookState.result.current
        expect(state).toMatchObject({ loading: true })

        await hookState.waitForNextUpdate()

        state = hookState.result.current
        expect(state).toMatchObject({
            loading: false,
            data: { q1: 42, q2: 43 },
        })

        expect(answerQuery.params).toHaveBeenCalledTimes(2)
        expect(answerQuery.params).toHaveBeenNthCalledWith(1, {}, {})
        expect(answerQuery.params).toHaveBeenNthCalledWith(2, {}, { q1: 42 })
    })
})
