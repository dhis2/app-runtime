import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { AlertsProvider, useAlert } from '../index'

describe('useAlert', () => {
    it('Hook returns a show and hide function', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(() => useAlert('test'), { wrapper })

        expect(result.current).toHaveProperty('show')
        expect(typeof result.current.show).toBe('function')
        expect(result.current).toHaveProperty('hide')
        expect(typeof result.current.hide).toBe('function')
    })
})
