import {
    requestContentType,
    requestHeadersForContentType,
    requestBodyForContentType,
} from './requestContentType'

describe('requestContentType', () => {
    it('returns "application/json" for a normal resource', () => {
        expect(
            requestContentType('create', { resource: 'test', data: 'test' })
        ).toEqual('application/json')
    })
    it('returns "application/json-patch+json" when the fetch type is "json-patch"', () => {
        expect(
            requestContentType('json-patch', { resource: 'test', data: 'test' })
        ).toEqual('application/json-patch+json')
    })
    it('returns "multipart/form-data" for a specific resource that expects it', () => {
        expect(
            requestContentType('create', {
                resource: 'fileResources',
                data: 'test',
            })
        ).toEqual('multipart/form-data')
    })
    it('returns "text/plain" for a specific resource that expects it', () => {
        expect(
            requestContentType('create', {
                resource: 'messageConversations/feedback',
                data: 'test',
            })
        ).toEqual('text/plain')
    })
})

describe('requestHeadersForContentType', () => {
    it('returns undefined if contentType is null', () => {
        expect(requestHeadersForContentType(null)).toEqual(undefined)
    })
    it('returns undefined if contentType is "multipart/form-data"', () => {
        expect(requestHeadersForContentType('multipart/form-data')).toEqual(
            undefined
        )
    })
    it('returns a headers object with the contentType for "application/json"', () => {
        expect(requestHeadersForContentType('application/json')).toEqual({
            'Content-Type': 'application/json',
        })
    })
    it('returns a headers object with the contentType for "text/plain"', () => {
        expect(requestHeadersForContentType('text/plain')).toEqual({
            'Content-Type': 'text/plain',
        })
    })
})

describe('requestBodyForContentType', () => {
    it('returns undefined if data is undefined', () => {
        expect(
            requestBodyForContentType('application/json', { resource: 'test' })
        ).toEqual(undefined)
    })
    it('JSON stringifies the data if contentType is "application/json"', () => {
        const dataIn = { a: 'AAAA', b: 1, c: true }
        const dataOut = JSON.stringify(dataIn)

        expect(
            requestBodyForContentType('application/json', {
                resource: 'test',
                data: dataIn,
            })
        ).toEqual(dataOut)
    })
    it('converts to FormData if contentType is "multipart/form-data"', () => {
        const file = new File(['foo'], 'foo.txt', { type: 'text/plain' })
        const data = { a: 'AAA', file }

        const result = requestBodyForContentType('multipart/form-data', {
            resource: 'test',
            data,
        })

        expect(result instanceof FormData).toEqual(true)
        expect(result.get('a')).toEqual('AAA')
        expect(result.get('file')).toEqual(file)
    })
    it('throws an error if contentType is "multipart/form-data" and data does have own string-keyd properties', () => {
        expect(() => {
            requestBodyForContentType('multipart/form-data', {
                resource: 'test',
                data: new File(['foo'], 'foo.txt', { type: 'text/plain' }),
            })
        }).toThrow(
            new Error(
                'Could not convert data to FormData: object does not have own enumerable string-keyed properties'
            )
        )
    })
    it('converts to URLSearchParams if contentType is "application/x-www-form-urlencoded"', () => {
        const data = { a: 'AAA' }

        const result = requestBodyForContentType(
            'application/x-www-form-urlencoded',
            {
                resource: 'test',
                data,
            }
        )

        expect(result instanceof URLSearchParams).toEqual(true)
        expect(result.get('a')).toEqual('AAA')
    })
    it('throws an error if contentType is "application/x-www-form-urlencoded" and data does have own string-keyd properties', () => {
        expect(() => {
            requestBodyForContentType('application/x-www-form-urlencoded', {
                resource: 'test',
                data: new File(['foo'], 'foo.txt', { type: 'text/plain' }),
            })
        }).toThrow(
            new Error(
                'Could not convert data to URLSearchParams: object does not have own enumerable string-keyed properties'
            )
        )
    })
    it('returns the data as received if contentType is "text/plain"', () => {
        const data = 'Something'

        expect(
            requestBodyForContentType('text/plain', {
                resource: 'messageConversations/feedback',
                data,
            })
        ).toEqual(data)
    })
})
