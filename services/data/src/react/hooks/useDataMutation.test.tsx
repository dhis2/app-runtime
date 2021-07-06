import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'
import { ReactNode } from 'react'
import { CreateMutation, UpdateMutation } from '../../engine/types/Mutation'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataMutation } from './useDataMutation'

let value = null
const customData = {
    answer: (_, query) => {
        value = query.data.answer
        return Promise.resolve({ value })
    },
}

const wrapper = ({ children }: { children?: ReactNode }) => (
    <CustomDataProvider data={customData}>{children}</CustomDataProvider>
)

const createMutation: CreateMutation = {
    type: 'create',
    resource: 'answer',
    data: jest.fn(() => ({ answer: 42 })),
}

const updateMutation: UpdateMutation = {
    type: 'update',
    id: 'id-0',
    resource: 'answer',
    data: jest.fn(() => ({ answer: 43 })),
}

describe('useDataMustation', () => {
    const originalError = console.error

    beforeEach(() => {
        console.error = jest.fn()
    })

    afterEach(() => {
        console.error = originalError
        createMutation.data.mockClear()
        updateMutation.data.mockClear()
    })

    it('Should render without failing', async () => {
        let hookState: any

        act(() => {
            hookState = renderHook(() => useDataMutation(createMutation), {
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

        act(() => {
            hookState = renderHook(
                () => useDataMutation(createMutation, { lazy: false }),
                { wrapper }
            )
        })

        let [, state] = hookState.result.current
        expect(state).toMatchObject({ called: true, loading: true })

        await hookState.waitForNextUpdate()

        state = hookState.result.current[1]
        expect(state).toMatchObject({
            loading: false,
            data: { value: 42 },
        })
    })

    it('should', async () => {
        let hookState: any
        const mutations = [{ m1: createMutation }, { m2: updateMutation }]

        act(() => {
            hookState = renderHook(
                () => useDataMutation(mutations, { lazy: false }),
                {
                    wrapper,
                }
            )
        })

        let [, state] = hookState.result.current
        expect(state).toMatchObject({ called: true, loading: true })

        await hookState.waitForNextUpdate()

        state = hookState.result.current[1]
        expect(state).toMatchObject({
            loading: false,
            data: {
                m1: { value: 42 },
                m2: { value: 43 },
            },
        })

        expect(createMutation.data).toHaveBeenCalledTimes(1)
        expect(updateMutation.data).toHaveBeenCalledTimes(1)
        expect(createMutation.data).toHaveBeenCalledWith({}, {})
        expect(updateMutation.data).toHaveBeenCalledWith(
            {},
            { m1: { value: 42 } }
        )
    })
})
