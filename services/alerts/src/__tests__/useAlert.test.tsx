import React, { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { AlertsProvider, useAlert } from '../index'

const wrapper = ({ children }: { children?: ReactNode }) => (
    <AlertsProvider>{children}</AlertsProvider>
)

describe('useAlert', () => {
    it('Renders without crashing', () => {
        const { result } = renderHook(() => useAlert('test'), { wrapper })

        expect(result.current).toHaveProperty('show')
        expect(typeof result.current.show).toBe('function')
    })
})
