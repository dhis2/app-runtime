import { getMutationFetchType } from './getMutationFetchType'

describe('getMutationFetchType', () => {
    it('should return the passed fetch type if not `update`', () => {
        expect(
            getMutationFetchType({ type: 'create', resource: 'test', data: {} })
        ).toBe('create')
        expect(
            getMutationFetchType({ type: 'delete', resource: 'test', id: 'id' })
        ).toBe('delete')
        expect(
            getMutationFetchType({
                type: 'jsonPatch',
                resource: 'test',
                data: {},
            })
        ).toBe('jsonPatch')
    })
    it('should return `replace` for non-partial `update`', () => {
        expect(
            getMutationFetchType({
                type: 'update',
                resource: 'test',
                id: 'id',
                data: {},
            })
        ).toBe('replace')
    })
    it('should return `update` for partial `update`', () => {
        expect(
            getMutationFetchType({
                type: 'update',
                partial: true,
                resource: 'test',
                id: 'id',
                data: {},
            })
        ).toBe('update')
    })
})
