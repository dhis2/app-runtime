import React from 'react'
import { useQueryExecutor } from './useQueryExecutor'
import { ExecuteHookInput, ExecuteHookResult } from '../types'
import {
    renderHook,
    act,
    RenderHookResult,
    HookResult,
} from '@testing-library/react-hooks'

const execute = jest.fn(async () => null)

describe('useQueryExecutor', () => {
    it('When not immediate, should start with called false and loading false', () => {
        const { result } = renderHook(() =>
            useQueryExecutor({
                execute,
                immediate: false,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: false,
            loading: false,
        })
    })

    it('When immediate, should start with called true and loading true', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useQueryExecutor({
                execute,
                immediate: false,
                singular: true,
                variables: {},
            })
        )

        expect(result.current).toMatchObject({
            called: false,
            loading: false,
        })

        act(() => {
            result.current.refetch()
        })
        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: false,
        })
        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: true,
        })
        await waitForNextUpdate()
        expect(result.current).toMatchObject({
            called: true,
            loading: false,
            data: null,
        })
    })
})
