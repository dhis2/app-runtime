import React, { ReactNode } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { AlertsProvider, useAlerts, useAlert } from '../index'

const wrapper = ({ children }: { children?: ReactNode }) => (
    <AlertsProvider>{children}</AlertsProvider>
)

describe('useAlert and useAlerts used together', () => {
    it('Can add an alert', () => {
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show } = useAlert('test', { permanent: true })

                return { alerts, show }
            },
            { wrapper }
        )

        act(() => {
            result.current.show()
        })

        expect(result.current.alerts).toHaveLength(1)

        const alert = result.current.alerts[0]

        expect(alert).toEqual(
            expect.objectContaining({
                id: 1,
                message: 'test',
                options: {
                    permanent: true,
                },
            })
        )
        expect(alert).toHaveProperty('remove')
        expect(typeof alert.remove).toBe('function')
    })

    it('Can remove an alert', () => {
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show } = useAlert('test', { permanent: true })

                return { alerts, show }
            },
            { wrapper }
        )

        act(() => {
            result.current.show()
        })

        expect(result.current.alerts).toHaveLength(1)

        act(() => {
            result.current.alerts[0].remove()
        })

        expect(result.current.alerts).toHaveLength(0)
    })

    it('Will not create duplicate alerts because of rerenders', () => {
        const hook = renderHook(
            () => {
                const alerts = useAlerts()
                const { show } = useAlert('test', { permanent: true })

                return { alerts, show }
            },
            { wrapper }
        )

        act(() => {
            hook.result.current.show()

            hook.rerender()
            hook.rerender()
        })

        expect(hook.result.current.alerts).toHaveLength(1)
    })

    it('Will create duplicate alerts when show is called multiple times in a render cycle', () => {
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show } = useAlert('test', { permanent: true })

                return { alerts, show }
            },
            { wrapper }
        )

        act(() => {
            result.current.show()
            result.current.show()
        })

        expect(result.current.alerts).toHaveLength(2)
    })
})
