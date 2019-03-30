import React from 'react'
import { useQuery } from '..'
import { render, waitForElement } from 'react-testing-library'
import { MockProvider } from '../components/MockProvider'
import { Query } from '../components/Query'
import { QueryRenderInput } from '../types/Query'

const mockData = {
    answer: 42,
}

describe('Testing mock data provider and useQuery hook', () => {
    it('Should render without failing', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data}</div>
            }
        )

        const { getByText } = render(
            <MockProvider mockData={mockData}>
                <Query query={{ resource: 'answer' }}>{renderFunction}</Query>
            </MockProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            loading: true,
        })
        await waitForElement(() => getByText(/data: /i))
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(renderFunction).toHaveBeenLastCalledWith({
            loading: false,
            data: mockData.answer,
        })
        expect(getByText(/data: /i)).toHaveTextContent(
            `data: ${mockData.answer}`
        )
    })
})

describe('Testing mock data provider and useQuery hook', () => {
    it('Should render an error', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data}</div>
            }
        )

        const { getByText } = render(
            <MockProvider mockData={mockData}>
                <Query query={{ resource: 'test' }}>{renderFunction}</Query>
            </MockProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            loading: true,
        })
        await waitForElement(() => getByText(/error: /i))
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(String(renderFunction.mock.calls[1][0].error)).toBe(
            'Error: No mock provided for resource type test!'
        )
        // expect(getByText(/data: /i)).toHaveTextContent(
        //     `data: ${mockData.answer}`
        // )
    })
})
