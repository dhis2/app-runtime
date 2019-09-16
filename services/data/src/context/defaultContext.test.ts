import { defaultContext } from './defaultContext'

describe('defaultContext', () => {
    const originalError = console.error
    const mockError = jest.fn()
    beforeEach(() => {
        jest.clearAllMocks()
        console.error = mockError
    })
    afterEach(() => (console.error = originalError))

    it('Should throw if query is called', () => {
        const context = defaultContext
        expect(
            context.engine.query({
                test: {
                    resource: 'test',
                },
            })
        ).rejects.toBeTruthy()

        expect(mockError).toHaveBeenCalledTimes(1)
        expect(mockError.mock.calls.pop()).toMatchInlineSnapshot(`
            Array [
              "DHIS2 data context must be initialized, please ensure that you include a <DataProvider> in your application",
            ]
        `)
    })

    it('Should throw and log if mutate is called', () => {
        const context = defaultContext
        expect(
            context.engine.mutate({
                type: 'create',
                resource: 'test',
                data: {},
            })
        ).rejects.toBeTruthy()
        expect(mockError).toHaveBeenCalled()
        expect(mockError.mock.calls.pop()).toMatchInlineSnapshot(`
            Array [
              "DHIS2 data context must be initialized, please ensure that you include a <DataProvider> in your application",
            ]
        `)
    })
})
