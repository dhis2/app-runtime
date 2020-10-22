import {
    requestContentType,
    requestHeadersForContentType,
    requestBodyForContentType,
    FORM_DATA_ERROR_MSG,
} from './requestContentType'

describe('requestContentType', () => {
    it('returns "application/json" for a normal resource', () => {
        expect(
            requestContentType('create', { resource: 'test', data: 'test' })
        ).toEqual('application/json')
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
    it('returns a headers object with the contentType supplied to it', () => {
        const contentType = 'application/json'
        expect(requestHeadersForContentType(contentType)).toEqual({
            'Content-Type': contentType,
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
        }).toThrow(new Error(FORM_DATA_ERROR_MSG))
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
