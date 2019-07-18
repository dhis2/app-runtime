import { makeCustomContext } from './makeCustomContext'

describe('makeCustomContext', () => {
    it('Should throw if requested custom resource is not provided', () => {
        const context = makeCustomContext({})
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
    it('Should return empty object on miss if failOnMiss=false', async () => {
        const context = makeCustomContext({}, { failOnMiss: false })
        expect(await context.fetch({ resource: 'test' })).toEqual({})
    })
    it('Should return custom resources', async () => {
        const customData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeCustomContext(customData)
        expect(await context.fetch({ resource: 'test' })).toEqual(
            customData.test
        )
        expect(await context.fetch({ resource: 'user' })).toEqual(
            customData.user
        )
    })
    it('Should resolve custom resource with function', async () => {
        const customData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeCustomContext(customData)
        expect(await context.fetch({ resource: 'test' })).toEqual(
            customData.test
        )
        expect(await context.fetch({ resource: 'user' })).toEqual(
            customData.user
        )
    })
    it('Should throw if resolver returns undefined', async () => {
        const customData = {
            test: () => undefined,
        }
        const context = makeCustomContext(customData)
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
    it('Should not throw if resolver returns undefined with failOnMiss=false', async () => {
        const customData = {
            test: () => undefined,
        }
        const context = makeCustomContext(customData, { failOnMiss: false })
        expect(context.fetch({ resource: 'test' })).resolves.toEqual({})
    })
    it('Should throw if custom data is something crazy like a bigint', async () => {
        const customData = {
            test: null as any,
        }
        const context = makeCustomContext(customData, { failOnMiss: false })
        expect(context.fetch({ resource: 'test' })).resolves.toEqual({})
    })
})
