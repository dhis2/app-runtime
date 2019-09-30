import React, { ReactNode } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { useDataQuery } from './useDataQuery'

const customData = {
    answer: 42,
}

const wrapper = ({ children }: { children?: ReactNode }) => (
    <CustomDataProvider data={customData}>{children}</CustomDataProvider>
)

const query = {
    x: {
        resource: 'answer',
    },
}
describe('useDataQuery', () => {
    const originalError = console.error

    afterEach(() => {
        console.error = originalError
    })

    it('Should render without failing', async () => {
        let hookState: any

        console.error = jest.fn()

        act(() => {
            hookState = renderHook(() => useDataQuery(query), {
                wrapper,
            })
        })

        expect(hookState.result.current).toMatchObject({ loading: true })
    })
})
