import React from 'react'
import { useDataQuery } from '../hooks/useDataQuery'
import { render, waitForElement } from '@testing-library/react'
import { CustomDataProvider } from '../components/CustomDataProvider'
import { DataQuery } from '../components/DataQuery'
import { QueryRenderInput } from '../types/Query'

const customData = {
    answer: 42,
}

describe('Testing custom data provider and useQuery hook', () => {
    it('Should render without failing', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data.answer}</div>
            }
        )

        const { getByText } = render(
            <CustomDataProvider data={customData}>
                <DataQuery query={{ answer: { resource: 'answer' } }}>
                    {renderFunction}
                </DataQuery>
            </CustomDataProvider>
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
            data: customData,
        })
        expect(getByText(/data: /i)).toHaveTextContent(
            `data: ${customData.answer}`
        )
    })
})

describe('Testing custom data provider and useQuery hook', () => {
    it('Should render an error', async () => {
        const renderFunction = jest.fn(
            ({ loading, error, data }: QueryRenderInput) => {
                if (loading) return 'loading'
                if (error) return <div>error: {error.message}</div>
                return <div>data: {data}</div>
            }
        )

        const { getByText } = render(
            <CustomDataProvider data={customData}>
                <DataQuery query={{ test: { resource: 'test' } }}>
                    {renderFunction}
                </DataQuery>
            </CustomDataProvider>
        )

        expect(getByText(/loading/i)).not.toBeUndefined()
        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith({
            loading: true,
        })
        await waitForElement(() => getByText(/error: /i))
        expect(renderFunction).toHaveBeenCalledTimes(2)
        expect(String(renderFunction.mock.calls[1][0].error)).toBe(
            'Error: No data provided for resource type test!'
        )
        // expect(getByText(/data: /i)).toHaveTextContent(
        //     `data: ${customData.answer}`
        // )
    })
})
