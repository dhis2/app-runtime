import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { AlertsProvider, useFetchAlert } from '../index'

describe('useFetchAlert', () => {
    it('Hook returns a showSuccess, showError and hide function', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(() => useFetchAlert(), { wrapper })

        expect(result.current).toHaveProperty('showSuccess')
        expect(typeof result.current.showSuccess).toBe('function')
        expect(result.current).toHaveProperty('showError')
        expect(typeof result.current.showError).toBe('function')
        expect(result.current).toHaveProperty('hide')
        expect(typeof result.current.hide).toBe('function')
    })
})
