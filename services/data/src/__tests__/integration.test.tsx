import { render, waitFor } from '@testing-library/react'
import * as React from 'react'
import { CustomDataProvider, DataQuery } from '../react'

describe('<DataQuery />', () => {
    it('should render without failing', async () => {
        const data = {
            answer: 42,
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )
        const renderFunction = jest.fn(() => null)

        render(
            <DataQuery query={{ answer: { resource: 'answer' } }}>
                {renderFunction}
            </DataQuery>,
            { wrapper }
        )

        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith(
            expect.objectContaining({
                called: true,
                loading: true,
            })
        )

        await waitFor(() => {
            expect(renderFunction).toHaveBeenCalledTimes(2)
            expect(renderFunction).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    called: true,
                    loading: false,
                    data,
                })
            )
        })
    })

    it('should render an error', async () => {
        const expectedError = new Error('Something went wrong')
        const data = {
            test: () => {
                throw expectedError
            },
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )
        const renderFunction = jest.fn(() => null)

        render(
            <DataQuery query={{ test: { resource: 'test' } }}>
                {renderFunction}
            </DataQuery>,
            { wrapper }
        )

        expect(renderFunction).toHaveBeenCalledTimes(1)
        expect(renderFunction).toHaveBeenLastCalledWith(
            expect.objectContaining({
                called: true,
                loading: true,
            })
        )

        await waitFor(() => {
            expect(renderFunction).toHaveBeenCalledTimes(2)
            expect(renderFunction).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    called: true,
                    loading: false,
                    error: expectedError,
                })
            )
        })
    })
})
