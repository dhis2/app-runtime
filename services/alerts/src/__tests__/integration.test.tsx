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

        expect(alert).toEqual({
            id: 1,
            remove: expect.any(Function),
            message: 'test',
            options: {
                permanent: true,
            },
        })
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

        expect(alert).toEqual({
            id: 1,
            remove: expect.any(Function),
            message: 'Successfully deleted hendrik',
            options: {
                critical: true,
            },
        })
    })

    it('Can remove an alert with the hide function from useAlerts', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show, hide } = useAlert('test', { permanent: true })

                return { alerts, show, hide }
            },
            { wrapper }
        )

        act(() => {
            result.current.show()
        })

        expect(result.current.alerts).toHaveLength(1)

        expect(result.current.alerts[0]).toEqual({
            id: 1,
            remove: expect.any(Function),
            message: 'test',
            options: {
                permanent: true,
            },
        })

        act(() => {
            result.current.hide()
        })

        expect(result.current.alerts).toHaveLength(0)
    })

    it('Can remove an alert with the remove function on the alert itself', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show, hide } = useAlert('test', { permanent: true })

                return { alerts, show, hide }
            },
            { wrapper }
        )

        act(() => {
            result.current.show()
        })

        expect(result.current.alerts).toHaveLength(1)

        expect(result.current.alerts[0]).toEqual({
            id: 1,
            remove: expect.any(Function),
            message: 'test',
            options: {
                permanent: true,
            },
        })

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

    it('Will not create duplicate alerts when show is called multiple times in a render cycle', () => {
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

        expect(result.current.alerts).toHaveLength(1)
    })

    it('Will update the alert if show is called with different arguments', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const { show } = useAlert(
                    ({ message }) => message,
                    ({ options }) => options
                )

                return { alerts, show }
            },
            { wrapper }
        )
        // Show alert for first time
        const payload1 = {
            message: 'Message 1',
            options: { permanent: true, critical: true },
        }

        act(() => {
            result.current.show(payload1)
        })

        expect(result.current.alerts).toHaveLength(1)
        expect(result.current.alerts[0]).toEqual({
            ...payload1,
            id: 1,
            remove: expect.any(Function),
            options: {
                ...payload1.options,
            },
        })

        // Show alert for second time
        const payload2 = {
            message: 'Message 2',
            options: { success: true },
        }

        act(() => {
            result.current.show(payload2)
        })

        expect(result.current.alerts).toHaveLength(1)
        expect(result.current.alerts[0]).toEqual({
            ...payload2,
            id: 1,
            remove: expect.any(Function),
            options: {
                ...payload2.options,
            },
        })
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
                const alert1 = useAlert('show 1')
                const alert2 = useAlert('show 2')
                const alert3 = useAlert('show 3')

                return { alerts, alert1, alert2, alert3 }
            },
            { wrapper }
        )

        act(() => {
            result.current.alert1.show()
            result.current.alert2.show()
            result.current.alert3.show()
        })

        expect(result.current.alerts).toHaveLength(3)

        act(() => {
            result.current.alert2.hide()
        })

        expect(result.current.alerts).toHaveLength(2)

        expect(result.current.alerts[0].id).toBe(1)
        expect(result.current.alerts[1].id).toBe(3)
    })

    it('Gets added into a new slot when show is called after hide', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const alert1 = useAlert('show 1')
                const alert2 = useAlert('show 2')

                return { alerts, alert1, alert2 }
            },
            { wrapper }
        )

        act(() => {
            result.current.alert1.show()
            result.current.alert2.show()
        })

        expect(result.current.alerts).toHaveLength(2)
        expect(result.current.alerts[0].id).toBe(1)
        expect(result.current.alerts[1].id).toBe(2)

        act(() => {
            result.current.alert1.hide()
        })

        expect(result.current.alerts).toHaveLength(1)
        expect(result.current.alerts[0].id).toBe(2)

        act(() => {
            result.current.alert1.show()
        })

        expect(result.current.alerts).toHaveLength(2)
        expect(result.current.alerts[0].id).toBe(2)
        // now is last item with id 3 because it was "re-added"
        expect(result.current.alerts[1].id).toBe(3)
    })
    it('Gets added into a new slot when show is called after remove is called on an alert', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result } = renderHook(
            () => {
                const alerts = useAlerts()
                const alert1 = useAlert('show 1')
                const alert2 = useAlert('show 2')

                return { alerts, alert1, alert2 }
            },
            { wrapper }
        )

        act(() => {
            result.current.alert1.show()
            result.current.alert2.show()
        })

        expect(result.current.alerts).toHaveLength(2)
        expect(result.current.alerts[0].id).toBe(1)
        expect(result.current.alerts[1].id).toBe(2)

        act(() => {
            result.current.alerts[0].remove()
        })

        expect(result.current.alerts).toHaveLength(1)
        expect(result.current.alerts[0].id).toBe(2)

        act(() => {
            result.current.alert1.show()
        })

        expect(result.current.alerts).toHaveLength(2)
        expect(result.current.alerts[0].id).toBe(2)
        // now is last item with id 3 because it was "re-added"
        expect(result.current.alerts[1].id).toBe(3)
    })
})
