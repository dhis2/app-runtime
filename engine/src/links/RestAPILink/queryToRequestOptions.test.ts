import { queryToRequestOptions } from './queryToRequestOptions'

describe('queryToRequestOptions', () => {
    it('should return a valid Fetch option object for read request', () => {
        const options = queryToRequestOptions('read', { resource: 'test' })
        expect(options).toMatchInlineSnapshot(`
            Object {
              "body": undefined,
              "headers": undefined,
              "method": "GET",
              "signal": undefined,
            }
        `)
    })

    it('should return a valid Fetch option object for create request', () => {
        const options = queryToRequestOptions('create', {
            resource: 'test',
            data: { answer: 42, foo: 'bar' },
        })
        expect(options).toMatchInlineSnapshot(`
            Object {
              "body": "{\\"answer\\":42,\\"foo\\":\\"bar\\"}",
              "headers": Object {
                "Content-Type": "application/json",
              },
              "method": "POST",
              "signal": undefined,
            }
        `)
    })

    it('should return a valid Fetch option object for update request', () => {
        const options = queryToRequestOptions('update', {
            resource: 'test',
            data: { answer: 42, foo: 'bar' },
        })
        expect(options).toMatchInlineSnapshot(`
            Object {
              "body": "{\\"answer\\":42,\\"foo\\":\\"bar\\"}",
              "headers": Object {
                "Content-Type": "application/json",
              },
              "method": "PATCH",
              "signal": undefined,
            }
        `)
    })

    it('should return a valid Fetch option object for json-patch request', () => {
        const options = queryToRequestOptions('json-patch', {
            resource: 'test',
            data: { answer: 42, foo: 'bar' },
        })
        expect(options).toMatchInlineSnapshot(`
            Object {
              "body": "{\\"answer\\":42,\\"foo\\":\\"bar\\"}",
              "headers": Object {
                "Content-Type": "application/json-patch+json",
              },
              "method": "PATCH",
              "signal": undefined,
            }
        `)
    })

    it('should return a valid Fetch option object for replace request', () => {
        const options = queryToRequestOptions('replace', {
            resource: 'test',
            data: { answer: 42, foo: 'bar' },
        })
        expect(options).toMatchInlineSnapshot(`
            Object {
              "body": "{\\"answer\\":42,\\"foo\\":\\"bar\\"}",
              "headers": Object {
                "Content-Type": "application/json",
              },
              "method": "PUT",
              "signal": undefined,
            }
        `)
    })

    it('should return a valid Fetch option object for delete request', () => {
        const options = queryToRequestOptions('delete', { resource: 'test' })
        expect(options).toMatchInlineSnapshot(`
            Object {
              "body": undefined,
              "headers": undefined,
              "method": "DELETE",
              "signal": undefined,
            }
        `)
    })
})
