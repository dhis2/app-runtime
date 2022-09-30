import { renderHook, act } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { ConnectedStatusProvider, useConnectedStatus } from '../index'
import {
    ConnectionStatus,
    ConnectionInfo,
    ConnectionInfoUpdate,
} from '../types'

describe('useConnectedStatus', () => {
    it('hook provides default connectionStatus', () => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConnectedStatusProvider>{children}</ConnectedStatusProvider>
        )
        const { result } = renderHook(() => useConnectedStatus(), {
            wrapper,
        })

        expect(result.current.connectionStatus).toEqual({
            status: 'disconnected',
        })
    })

    it.each([
        [
            'allowing messages with react elements',
            {
                status: 'connected',
                message: <span>Syncing</span>,
            },
            {
                status: 'connected',
                message: <span>Syncing</span>,
            },
        ],
        [
            'allowing messages with strings',
            {
                status: 'disconnected',
                message: '8 offline events',
            },
            {
                status: 'disconnected',
                message: '8 offline events',
            },
        ],
    ])(
        'calling updateConnectedStatus updates %s',
        (
            _: any,
            newConnectedStatus: ConnectionInfoUpdate,
            expectedConnectedStatus?: ConnectionInfo
        ) => {
            const wrapper = ({ children }: { children?: ReactNode }) => (
                <ConnectedStatusProvider>{children}</ConnectedStatusProvider>
            )
            const { result } = renderHook(() => useConnectedStatus(), {
                wrapper,
            })

            act(() => {
                result.current.updateConnectedStatus(newConnectedStatus)
            })

            expect(result.current.connectionStatus).toEqual(
                expectedConnectedStatus
            )
        }
    )

    it.each([
        [
            'allowing only message to be updated',
            {
                status: 'disconnected',
            },
            {
                message: '8 offline events',
            },
        ],
        [
            'allowing only status to be updated',
            {
                status: 'disconnected',
                message: '8 offline events',
            },
            {
                status: 'reconnecting',
            },
        ],
    ])(
        'calling updateConnectedStatus updates %s',
        (
            _: any,
            initialConnectedStatus: ConnectionInfo,
            newConnectedStatus: ConnectionInfoUpdate
        ) => {
            const wrapper = ({ children }: { children?: ReactNode }) => (
                <ConnectedStatusProvider>{children}</ConnectedStatusProvider>
            )
            const { result } = renderHook(() => useConnectedStatus(), {
                wrapper,
            })

            act(() => {
                result.current.updateConnectedStatus(initialConnectedStatus)
            })

            act(() => {
                result.current.updateConnectedStatus(newConnectedStatus)
            })

            const expectedConnectedStatus = {
                ...initialConnectedStatus,
                ...newConnectedStatus,
            }

            expect(result.current.connectionStatus).toEqual(
                expectedConnectedStatus
            )
        }
    )

    it.each([
        [
            'allows status to be updated to disconnected',
            'connected',
            'disconnected',
        ],
        [
            'allows status to be updated to connected',
            'disconnected',
            'connected',
        ],
        [
            'allows status to be updated to reconnecting',
            'disconnected',
            'reconnecting',
        ],
        ['allows status to be updated to syncing', 'connected', 'syncing'],
    ])(
        'calling updateConnectedStatus %s',
        (_: any, initialStatus: string, newStatus: string) => {
            const wrapper = ({ children }: { children?: ReactNode }) => (
                <ConnectedStatusProvider>{children}</ConnectedStatusProvider>
            )
            const { result } = renderHook(() => useConnectedStatus(), {
                wrapper,
            })

            act(() => {
                result.current.updateConnectedStatus({
                    status: initialStatus,
                })
            })

            act(() => {
                result.current.updateConnectedStatus({
                    status: newStatus,
                })
            })

            expect(result.current.connectionStatus).toEqual({
                status: newStatus,
            })
        }
    )

    it.each([
        ['undefined results in error', undefined],
        ['an unsupported status results in error', 'unsupported-status'],
    ])('calling updateConnectedStatus with %s', (_: any, status?: string) => {
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConnectedStatusProvider>{children}</ConnectedStatusProvider>
        )
        const { result } = renderHook(() => useConnectedStatus(), {
            wrapper,
        })

        expect(() => {
            result.current.updateConnectedStatus({ status })
        }).toThrow(
            new Error(
                `connected status can only be set to one of: ${Object.values(
                    ConnectionStatus
                )}`
            )
        )
    })
})
