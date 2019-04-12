import { makeOfflineContext } from './makeOfflineContext'
import { QueryDefinition } from '../types/Query'
import { bigIntLiteral } from '@babel/types'

describe('makeOfflineContext', () => {
    it('Should throw if requested offline resource is not provided', () => {
        const context = makeOfflineContext({})
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
    it('Should return empty object on miss if failOnMiss=false', async () => {
        const context = makeOfflineContext({}, { failOnMiss: false })
        expect(await context.fetch({ resource: 'test' })).toEqual({})
    })
    it('Should return offline resources', async () => {
        const offlineData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeOfflineContext(offlineData)
        expect(await context.fetch({ resource: 'test' })).toEqual(offlineData.test)
        expect(await context.fetch({ resource: 'user' })).toEqual(offlineData.user)
    })
    it('Should resolve offline resource with function', async () => {
        const offlineData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeOfflineContext(offlineData)
        expect(await context.fetch({ resource: 'test' })).toEqual(offlineData.test)
        expect(await context.fetch({ resource: 'user' })).toEqual(offlineData.user)
    })
    it('Should throw if resolver returns undefined', async () => {
        const offlineData = {
            test: () => undefined,
        }
        const context = makeOfflineContext(offlineData)
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
    it('Should not throw if resolver returns undefined with failOnMiss=false', async () => {
        const offlineData = {
            test: () => undefined,
        }
        const context = makeOfflineContext(offlineData, { failOnMiss: false })
        expect(context.fetch({ resource: 'test' })).resolves.toEqual({})
    })
    it('Should throw if offline data is something crazy like a bigint', async () => {
        const offlineData = {
            test: null as any,
        }
        const context = makeOfflineContext(offlineData, { failOnMiss: false })
        expect(context.fetch({ resource: 'test' })).resolves.toEqual({})
    })
})
