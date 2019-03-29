import { makeMockContext } from './makeMockContext'

describe('makeMockContext', () => {
    it('Should throw if requested resource is not mocked', () => {
        const context = makeMockContext({ mockData: {} })
        expect(() => context.fetch({ resource: 'test' })).toThrow()
    })
    it('Should return mocked resources', async () => {
        const mockData = {
            test: { value: 'something' },
            user: { id: 42 },
        }
        const context = makeMockContext({
            mockData,
        })
        expect(await context.fetch({ resource: 'test' })).toEqual(mockData.test)
        expect(await context.fetch({ resource: 'user' })).toEqual(mockData.user)
    })
})
