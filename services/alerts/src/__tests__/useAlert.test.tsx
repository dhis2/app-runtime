import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { AlertsProvider, useAlert } from '../index'

describe('useAlert', () => {
    it('Renders without crashing', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(() => useAlert('test'), { wrapper })

        expect(result.current).toHaveProperty('show')
        expect(typeof result.current.show).toBe('function')
    })
})
