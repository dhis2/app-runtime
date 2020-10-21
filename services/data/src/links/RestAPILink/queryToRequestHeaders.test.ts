import {
    queryToRequestHeaders,
    contentTypeForResource,
} from './queryToRequestHeaders'

describe('queryToRequestHeaders', () => {
    it('returns undefined if query.data is falsey', () => {
        expect(queryToRequestHeaders('create', { resource: 'test' })).toEqual(
            undefined
        )
    })
    it('return a header object with Content-Type application/json if query.data is defined', () => {
        expect(
            queryToRequestHeaders('create', { resource: 'test', data: 'test' })
        ).toEqual({ 'Content-Type': 'application/json' })
    })
})

describe('contentTypeForResource', () => {
    it('returns "application/json" for a normal resource', () => {
        expect(
            contentTypeForResource('create', { resource: 'test', data: 'test' })
        ).toEqual('application/json')
    })
    it('returns "multipart/form-data" if data contains a FormData instance', () => {
        const data = new FormData()
        data.append('testKey', 'testValue')

        expect(
            contentTypeForResource('create', { resource: 'test', data })
        ).toEqual('multipart/form-data')
    })
    it('returns "text/plain" for a specific resource', () => {
        expect(
            contentTypeForResource('create', {
                resource: 'messageConversations/feedback',
                data: 'test',
            })
        ).toEqual('text/plain')
    })
})
