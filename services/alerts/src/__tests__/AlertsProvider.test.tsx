import { act, render } from '@testing-library/react'
import React from 'react'
import { AlertsProvider, useAlert } from '../index'

describe('AlertsProvider', () => {
    it('Does not re-render useAlert consumers when an alert is added or removed', () => {
        let renderCount = 0
        let alert: ReturnType<typeof useAlert> | undefined
        const Consumer = () => {
            renderCount++
            alert = useAlert('test')
            return null
        }

        render(
            <AlertsProvider>
                <Consumer />
            </AlertsProvider>
        )
        expect(renderCount).toBe(1)

        act(() => {
            alert?.show()
        })
        act(() => {
            alert?.hide()
        })

        expect(renderCount).toBe(1)
    })
})
