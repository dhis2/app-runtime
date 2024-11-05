import { renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { AlertsProvider, useAlerts } from '../index'

describe('useAlerts', () => {
    it('Renders without crashing', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )

        const { result } = renderHook(() => useAlerts(), { wrapper })

        expect(result.current).toEqual([])
    })
})
