import React from 'react'
import {
    MutationRenderInput,
    Mutation,
    MutationFunction,
} from '../types/Mutation'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { DataMutation } from '../components/DataMutation'
import { render, act, waitForElement } from '@testing-library/react'
import { QueryDefinition } from '../types/Query'

const mockBackend = {
    target: jest.fn((querydef: QueryDefinition, options: RequestInit) => {
        expect(querydef.resource).toBe('target')
        expect(options.method).toBe('POST')
        expect(options.body).toBe(JSON.stringify({ question: '?' }))
        expect(
            options.headers && (options.headers as any)['Content-Type']
        ).toBe('application/json')
        return Promise.resolve({ answer: 42 })
    }),
}

describe('Test mutations', () => {
    it('Should call the mock callback', async () => {
        let doMutation: MutationFunction | undefined
        const renderFunction = jest.fn(
            ([
                mutate,
                { called, loading, error, data },
            ]: MutationRenderInput) => {
                doMutation = mutate

                if (!called) return 'uncalled'
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                if (data) return <div>data: {data.answer}</div>
            }
        )

        const testMutation: Mutation = {
            resource: 'target',
            type: 'create',
            data: {
                question: '?',
            },
        }
        const { getByText } = render(
            <CustomDataProvider data={mockBackend}>
                <DataMutation mutation={testMutation}>
                    {renderFunction}
                </DataMutation>
            </CustomDataProvider>
        )

        expect(getByText(/uncalled/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(mockBackend.target).not.toHaveBeenCalled()
        expect(renderFunction).toHaveBeenLastCalledWith([
            expect.any(Function),
            {
                called: false,
                loading: false,
            },
        ])
        expect(doMutation).not.toBeUndefined()
        act(() => {
            doMutation && doMutation()
        })
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith([
            doMutation,
            {
                called: true,
                loading: true,
            },
        ])
        expect(mockBackend.target).toHaveBeenCalledTimes(1)

        await waitForElement(() => getByText(/data: /i))
        expect(renderFunction).toHaveBeenCalledTimes(3)
        expect(renderFunction).toHaveBeenLastCalledWith([
            doMutation,
            {
                called: true,
                loading: false,
                data: { answer: 42 },
            },
        ])
        expect(getByText(/data: /i)).toHaveTextContent(`data: 42`)
    })
})
