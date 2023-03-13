import {
    getResourceQueryErrors,
    validateResourceQuery,
    validateResourceQueries,
} from './validate'

describe('query validation', () => {
    describe('getResourceQueryErrors', () => {
        it('should pass with a simple valid query', () => {
            expect(
                getResourceQueryErrors('read', {
                    resource: 'me',
                })
            ).toHaveLength(0)
        })

        it('should pass with a simple valid mutation', () => {
            expect(
                getResourceQueryErrors('create', {
                    resource: 'indicators',
                    data: {
                        this: 'is a test',
                    },
                })
            ).toHaveLength(0)
        })

        it('should fail if an unknown type is specified', () => {
            const errors = getResourceQueryErrors('rainbow', {
                resource: 'me',
            })
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Unknown query or mutation type rainbow",
                ]
            `)
        })

        it('should fail if query is not an object', () => {
            let errors = getResourceQueryErrors('read', 'query' as any)
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "A query or mutation must be a javascript object",
                ]
            `)

            errors = getResourceQueryErrors('read', 42 as any)
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "A query or mutation must be a javascript object",
                ]
            `)
        })

        it('should fail if query is missing resource property', () => {
            const errors = getResourceQueryErrors('read', {} as any)
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Property resource must be a string",
                ]
            `)
        })

        it('should fail if query is missing resource property', () => {
            const errors = getResourceQueryErrors('read', {} as any)
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Property resource must be a string",
                ]
            `)
        })

        it('should fail if query is create mutation with id prop', () => {
            const errors = getResourceQueryErrors('create', {
                resource: 'indicators',
                id: 'something',
            })
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Mutation type 'create' does not support property 'id'",
                ]
            `)
        })

        it('should fail if id prop is not a string', () => {
            const errors = getResourceQueryErrors('update', {
                resource: 'indicators',
                id: 42 as any,
            })
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Property id must be a string",
                ]
            `)
        })

        it('should fail if params prop is not an object', () => {
            const errors = getResourceQueryErrors('update', {
                resource: 'indicators',
                id: '42',
                params: 'querystring=42' as any,
            })
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Property params must be an object",
                ]
            `)
        })

        it('should fail if query is delete mutation with data prop', () => {
            const errors = getResourceQueryErrors('delete', {
                resource: 'indicators',
                id: '42',
                data: 'querystring=42',
            })
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Mutation type 'delete' does not support property 'data'",
                ]
            `)
        })

        it('should fail if query is json-patch mutation with non-array data prop', () => {
            const errors = getResourceQueryErrors('json-patch', {
                resource: 'metadata',
                data: {},
            })
            expect(errors).toHaveLength(1)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Mutation type 'json-patch' requires property 'data' to be of type Array",
                ]
            `)
        })

        it('should fail if unrecognized keys are passed to query', () => {
            const errors = getResourceQueryErrors('update', {
                resource: 'indicators',
                id: '42',
                query: 'something',
                foo: 'bar',
            } as any)
            expect(errors).toHaveLength(2)
            expect(errors).toMatchInlineSnapshot(`
                Array [
                  "Property query is not supported",
                  "Property foo is not supported",
                ]
            `)
        })
    })

    describe('validateResourceQuery', () => {
        it('should pass with a valid query', () => {
            expect(() =>
                validateResourceQuery('read', {
                    resource: 'me',
                })
            ).not.toThrowError()
        })
        it('should throw an error with an invalid query', () => {
            expect(() =>
                validateResourceQuery('create', {
                    resource: 'me',
                    id: '42',
                })
            ).toThrowErrorMatchingInlineSnapshot(`
"Invalid query
 - Mutation type 'create' does not support property 'id'"
`)
        })

        it('should throw an error with an invalid query', () => {
            expect(() =>
                validateResourceQuery('create', {
                    resource: 'me',
                    answer: 42,
                } as any)
            ).toThrowErrorMatchingInlineSnapshot(`
"Invalid query
 - Property answer is not supported"
`)
        })
    })

    describe('validateResourceQueries', () => {
        it('should pass with valid queries', () => {
            expect(() =>
                validateResourceQueries(
                    [
                        {
                            resource: 'me',
                        },
                        {
                            resource: 'indicators',
                        },
                    ],
                    ['me', 'ind']
                )
            ).not.toThrowError()
        })
        it('should throw if any query is invalid', () => {
            expect(() =>
                validateResourceQueries([
                    {
                        resource: 'me',
                    },
                    {
                        resource: 'indicators',
                        params: 'parameters',
                    } as any,
                    {
                        resource: 'me',
                        id: 42,
                    },
                ])
            ).toThrowErrorMatchingInlineSnapshot(`
"Invalid query
 - [query#1] Property params must be an object
 - [query#2] Property id must be a string"
`)
        })

        it('should throw if any query is invalid, prefixing with relevant name', () => {
            expect(() =>
                validateResourceQueries(
                    [
                        {
                            resource: 'me',
                        },
                        {
                            resource: 'indicators',
                            params: 'parameters',
                        } as any,
                        {
                            resource: 'me',
                            id: 42,
                        },
                    ],
                    ['me', 'inds']
                )
            ).toThrowErrorMatchingInlineSnapshot(`
"Invalid query
 - [inds] Property params must be an object
 - [query#2] Property id must be a string"
`)
        })
    })
})
