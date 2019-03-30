import { defaultContext } from './defaultContext'

describe('defaultContext', () => {
    it('Should throw if fetch is called', () => {
        const context = defaultContext
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
})
