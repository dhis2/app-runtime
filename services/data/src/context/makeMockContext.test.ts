import { makeMockContext } from './makeMockContext'
import { QueryDefinition } from '../types/Query'
import { bigIntLiteral } from '@babel/types'

describe('makeMockContext', () => {
    it('Should throw if requested resource is not mocked', () => {
        const context = makeMockContext({})
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
    it('Should return empty object on miss if failOnMiss=false', async () => {
        const context = makeMockContext({}, { failOnMiss: false })
        expect(await context.fetch({ resource: 'test' })).toEqual({})
    })
    it('Should return mocked resources', async () => {
        const mockData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeMockContext(mockData)
        expect(await context.fetch({ resource: 'test' })).toEqual(mockData.test)
        expect(await context.fetch({ resource: 'user' })).toEqual(mockData.user)
    })
    it('Should resolve mocked resource with function', async () => {
        const mockData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeMockContext(mockData)
        expect(await context.fetch({ resource: 'test' })).toEqual(mockData.test)
        expect(await context.fetch({ resource: 'user' })).toEqual(mockData.user)
    })
    it('Should throw if resolver returns undefined', async () => {
        const mockData = {
            test: () => undefined,
        }
        const context = makeMockContext(mockData)
        expect(context.fetch({ resource: 'test' })).rejects.toBeTruthy()
    })
    it('Should not throw if resolver returns undefined with failOnMiss=false', async () => {
        const mockData = {
            test: () => undefined,
        }
        const context = makeMockContext(mockData, { failOnMiss: false })
        expect(context.fetch({ resource: 'test' })).resolves.toEqual({})
    })
    it('Should throw if mock is something crazy like a bigint', async () => {
        const mockData = {
            test: null as any,
        }
        const context = makeMockContext(mockData, { failOnMiss: false })
        expect(context.fetch({ resource: 'test' })).resolves.toEqual({})
    })
})
