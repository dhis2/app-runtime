import { renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { AlertsManagerContext, AlertsProvider, useAlert } from '../index'
import type { AlertsManager } from '../types'

const createWrapper = (manager: Partial<AlertsManager> = {}) => {
    const value: AlertsManager = {
        add: jest.fn((alert) => alert),
        plugin: false,
        parentAlertsAdd: null,
        showAlertsInPlugin: false,
        ...manager,
    }
    const wrapper = ({ children }: { children?: ReactNode }) => (
        <AlertsManagerContext.Provider value={value}>
            {children}
        </AlertsManagerContext.Provider>
    )
    return { value, wrapper }
}

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

    it('Returns a stable show function when called with an inline message function and inline options', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result, rerender } = renderHook(
            () => useAlert(({ name }) => `Deleted ${name}`, { success: true }),
            { wrapper }
        )
        const { show, hide } = result.current

        rerender()

        expect(result.current.show).toBe(show)
        expect(result.current.hide).toBe(hide)
    })

    it('Returns a stable show function when called without options', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <AlertsProvider>{children}</AlertsProvider>
        )
        const { result, rerender } = renderHook(() => useAlert('Saved'), {
            wrapper,
        })
        const { show } = result.current

        rerender()

        expect(result.current.show).toBe(show)
    })

    it('Uses the latest message when an earlier show is called', () => {
        const { value, wrapper } = createWrapper()
        const { result, rerender } = renderHook(
            ({ message }) => useAlert(message, { success: true }),
            { wrapper, initialProps: { message: 'first' } }
        )
        const { show } = result.current

        rerender({ message: 'second' })
        show()

        expect(value.add).toHaveBeenCalledWith(
            { message: 'second', options: { success: true } },
            expect.anything()
        )
    })

    it('Uses the latest options when an earlier show is called', () => {
        const { value, wrapper } = createWrapper()
        const { result, rerender } = renderHook(
            ({ options }) => useAlert('message', options),
            { wrapper, initialProps: { options: { success: true } } }
        )
        const { show } = result.current

        rerender({ options: { critical: true } })
        show()

        expect(value.add).toHaveBeenCalledWith(
            { message: 'message', options: { critical: true } },
            expect.anything()
        )
    })

    it('Passes the props given to show to message and options functions', () => {
        const { value, wrapper } = createWrapper()
        const { result } = renderHook(
            () =>
                useAlert(
                    ({ name }) => `Deleted ${name}`,
                    ({ isCurrentUser }) =>
                        isCurrentUser ? { critical: true } : { success: true }
                ),
            { wrapper }
        )

        result.current.show({ name: 'hendrik', isCurrentUser: true })

        expect(value.add).toHaveBeenCalledWith(
            { message: 'Deleted hendrik', options: { critical: true } },
            expect.anything()
        )
    })

    it('Sends plugin alerts to the parent', () => {
        const parentAlertsAdd = jest.fn(() => Promise.resolve({}))
        const { value, wrapper } = createWrapper({
            plugin: true,
            parentAlertsAdd,
        })
        const { result } = renderHook(() => useAlert('message'), { wrapper })

        result.current.show()

        expect(parentAlertsAdd).toHaveBeenCalledWith(
            { message: 'message', options: {} },
            expect.anything()
        )
        expect(value.add).not.toHaveBeenCalled()
    })

    it('Shows plugin alerts in the plugin when showAlertsInPlugin is set', () => {
        const parentAlertsAdd = jest.fn(() => Promise.resolve({}))
        const { value, wrapper } = createWrapper({
            plugin: true,
            parentAlertsAdd,
            showAlertsInPlugin: true,
        })
        const { result } = renderHook(() => useAlert('message'), { wrapper })

        result.current.show()

        expect(value.add).toHaveBeenCalledWith(
            { message: 'message', options: {} },
            expect.anything()
        )
        expect(parentAlertsAdd).not.toHaveBeenCalled()
    })
})
