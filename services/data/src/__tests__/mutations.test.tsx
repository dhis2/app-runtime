import { render, waitFor, act } from '@testing-library/react'
import * as React from 'react'
import { CustomDataProvider, DataMutation } from '../react'

describe('<DataMutation />', () => {
    it('should render without failing', async () => {
        const endpointSpy = jest.fn(() => Promise.resolve(42))
        const mutation = {
            resource: 'answer',
            type: 'create',
            data: {
                question: '?',
            },
        }
        const data = {
            answer: endpointSpy,
        }
        const wrapper = ({ children }) => (
            <CustomDataProvider data={data}>{children}</CustomDataProvider>
        )
        const renderSpy = jest.fn(() => null)
        render(<DataMutation mutation={mutation}>{renderSpy}</DataMutation>, {
            wrapper,
        })

        expect(endpointSpy).toHaveBeenCalledTimes(0)
        expect(renderSpy).toHaveBeenCalledTimes(1)
        expect(renderSpy).toHaveBeenLastCalledWith([
            expect.any(Function),
            expect.objectContaining({
                called: false,
                loading: false,
                engine: expect.any(Object),
            }),
        ])

        await act(async () => {
            const firstRenderSpyCall = renderSpy.mock.calls[0]
            const firstRenderSpyArgument = firstRenderSpyCall[0]
            const [mutate] = firstRenderSpyArgument
            await mutate()
        })

        waitFor(() => {
            expect(endpointSpy).toHaveBeenCalledTimes(1)
            expect(renderSpy).toHaveBeenCalledTimes(2)
            expect(renderSpy).toHaveBeenLastCalledWith([
                expect.any(Function),
                expect.objectContaining({
                    called: true,
                    loading: true,
                    engine: expect.any(Object),
                }),
            ])
        })

        waitFor(() => {
            expect(endpointSpy).toHaveBeenCalledTimes(1)
            expect(renderSpy).toHaveBeenCalledTimes(3)
            expect(renderSpy).toHaveBeenLastCalledWith([
                expect.any(Function),
                expect.objectContaining({
                    called: true,
                    loading: false,
                    data: { answer: 42 },
                    engine: expect.any(Object),
                }),
            ])
        })
    })
})
