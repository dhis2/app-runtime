import { renderHook, act } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { AlertsProvider, useAlerts, useAlert } from '../index'

describe('useAlert and useAlerts used together', () => {
    it('Can add an alert with static arguments', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
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

    it('Can add an alert with dynamic arguments', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show } = useAlert(
                    ({ username }) => `Successfully deleted ${username}`,
                    ({ isCurrentUser }) =>
                        isCurrentUser ? { critical: true } : { success: true }
                )

                return { alerts, show }
            },
            { wrapper }
        )

        act(() => {
            result.current.show({ username: 'hendrik', isCurrentUser: true })
        })

        expect(result.current.alerts).toHaveLength(1)

        const alert = result.current.alerts[0]

        expect(alert).toEqual(
            expect.objectContaining({
                id: 1,
                message: 'Successfully deleted hendrik',
                options: {
                    critical: true,
                },
            })
        )
        expect(alert).toHaveProperty('remove')
        expect(typeof alert.remove).toBe('function')
    })

    it('Can remove an alert', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
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
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
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
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
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

    it('Will increment IDs when multiple alerts are added', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show: show1 } = useAlert('show 1')
                const { show: show2 } = useAlert('show 2')
                const { show: show3 } = useAlert('show 3')

                return { alerts, show1, show2, show3 }
            },
            { wrapper }
        )

        act(() => {
            result.current.show1()
            result.current.show2()
            result.current.show3()
        })

        expect(result.current.alerts).toHaveLength(3)

        expect(result.current.alerts[0].id).toBe(1)
        expect(result.current.alerts[1].id).toBe(2)
        expect(result.current.alerts[2].id).toBe(3)
    })

    it('Removes the correct item from the alerts array', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show: show1 } = useAlert('show 1')
                const { show: show2 } = useAlert('show 2')
                const { show: show3 } = useAlert('show 3')

                return { alerts, show1, show2, show3 }
            },
            { wrapper }
        )

        act(() => {
            result.current.show1()
            result.current.show2()
            result.current.show3()
        })

        expect(result.current.alerts).toHaveLength(3)

        act(() => {
            result.current.alerts[1].remove()
        })

        expect(result.current.alerts).toHaveLength(2)

        expect(result.current.alerts[0].id).toBe(1)
        expect(result.current.alerts[1].id).toBe(3)
    })
})
