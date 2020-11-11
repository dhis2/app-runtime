import React, { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { AlertsProvider, useAlerts } from '../index'

const wrapper = ({ children }: { children?: ReactNode }) => (
    <AlertsProvider>{children}</AlertsProvider>
)

describe('useAlerts', () => {
    it('Renders without crashing', () => {
        const { result } = renderHook(() => useAlerts(), { wrapper })

        expect(result.current).toEqual([])
    })
})
