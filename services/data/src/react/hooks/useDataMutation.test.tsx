import React, { ReactNode } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataMutation } from './useDataMutation'
import { CreateMutation } from '../../engine/types/Mutation'

const customData = {
    answer: 42,
}

const wrapper = ({ children }: { children?: ReactNode }) => (
    <CustomDataProvider data={customData}>{children}</CustomDataProvider>
)

const mutation: CreateMutation = {
    type: 'create',
    resource: 'answer',
    data: { answer: 42 },
}
describe('useDataMustation', () => {
    const originalError = console.error

    afterEach(() => {
        console.error = originalError
    })

    it('Should render without failing', async () => {
        let hookState: any

        console.error = jest.fn()

        act(() => {
            hookState = renderHook(() => useDataMutation(mutation), {
                wrapper,
            })
        })

        let [mutate, state] = hookState.result.current
        expect(state).toMatchObject({ called: false, loading: false })

        act(() => {
            mutate()
        })

        mutate = hookState.result.current[0]
        state = hookState.result.current[1]
        expect(state).toMatchObject({ called: true, loading: true })
    })

    it('Should run immediately with lazy: false', async () => {
        let hookState: any

        console.error = jest.fn()

        act(() => {
            hookState = renderHook(
                () => useDataMutation(mutation, { lazy: false }),
                {
                    wrapper,
                }
            )
        })

        let [, state] = hookState.result.current
        expect(state).toMatchObject({ called: true, loading: true })

        await hookState.waitForNextUpdate()

        state = hookState.result.current[1]
        expect(state).toMatchObject({ loading: false, data: 42 })
    })
})
