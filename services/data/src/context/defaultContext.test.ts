import { defaultContext } from './defaultContext'

describe('defaultContext', () => {
    it('Should throw if fetch is called', () => {
        const context = defaultContext
        expect(
            context.engine.query({
                test: {
                    resource: 'test',
                },
            })
        ).rejects.toBeTruthy()

        expect(
            context.engine.mutate({
                type: 'create',
                resource: 'test',
                data: {},
            })
        ).rejects.toBeTruthy()
    })
})
