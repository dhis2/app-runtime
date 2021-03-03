import { validateResourceQuery } from './validateQuery'

describe('validateQuery', () => {
    const originalConsoleWarn = console.warn
    afterAll(() => {
        console.warn = originalConsoleWarn
    })
    it('Should return true and NOT console.warn for a valid query', () => {
        console.warn = jest.fn()

        expect(
            validateResourceQuery(
                { resource: 'resource', params: { fields: 'name' } },
                'read'
            )
        ).toBe(true)
        expect(console.warn).not.toHaveBeenCalled()
        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: ['name', 'id'], pageSize: 35, page: 2 },
                },
                'read'
            )
        ).toBe(true)
        expect(console.warn).not.toHaveBeenCalled()
        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: {
                        fields: ['name', 'shortName'],
                        paging: true,
                        pageSize: 20,
                    },
                },
                'read'
            )
        ).toBe(true)
        expect(console.warn).not.toHaveBeenCalled()
    })

    it('Should return ture for mutations', () => {
        console.warn = jest.fn()

        expect(
            validateResourceQuery(
                { resource: 'resource', params: { paging: false } },
                'create'
            )
        ).toBe(true)
        expect(console.warn).not.toHaveBeenCalled()

        expect(validateResourceQuery({ resource: 'resource' }, 'update')).toBe(
            true
        )
        expect(console.warn).not.toHaveBeenCalled()

        expect(validateResourceQuery({ resource: 'resource' }, 'delete')).toBe(
            true
        )
        expect(console.warn).not.toHaveBeenCalled()
    })

    it('Should return false but not warn in production mode', () => {
        console.warn = jest.fn()
        process.env.NODE_ENV = 'production'

        expect(
            validateResourceQuery(
                { resource: 'resource', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(false)
        expect(console.warn).not.toHaveBeenCalled()

        process.env.NODE_ENV = 'test'
    })

    it('Should return false and warn in development mode', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                { resource: 'resource', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should not use wildcard or dynamic field groups"`
        )

        process.env.NODE_ENV = 'test'
    })

    it('Should detect missing fields', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(validateResourceQuery({ resource: 'resource' }, 'read')).toBe(
            false
        )
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should always specify fields to return"`
        )

        process.env.NODE_ENV = 'test'
    })

    it('Should detect paging false', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: ['name'], paging: false },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries with paging=false are deprecated and should not be used!"`
        )

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: ['name'], paging: 'false' },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries with paging=false are deprecated and should not be used!"`
        )

        process.env.NODE_ENV = 'test'
    })

    it('Should detect wildcard fields', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                { resource: 'resource', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should not use wildcard or dynamic field groups"`
        )

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: 'test, :all, something' },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should not use wildcard or dynamic field groups"`
        )

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: ['asdf', ':owner'] },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should not use wildcard or dynamic field groups"`
        )

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: ['*', ':owner', ':all'] },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should not use wildcard or dynamic field groups"`
        )

        process.env.NODE_ENV = 'test'
    })

    it('Should warn for multiple errors in one query', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { fields: ['*'], paging: false },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(2)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries with paging=false are deprecated and should not be used!"`
        )
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should not use wildcard or dynamic field groups"`
        )

        expect(
            validateResourceQuery(
                {
                    resource: 'resource',
                    params: { paging: false },
                },
                'read'
            )
        ).toBe(false)
        expect(warn).toHaveBeenCalledTimes(2)
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries with paging=false are deprecated and should not be used!"`
        )
        expect(warn.mock.calls.shift()[0]).toMatchInlineSnapshot(
            `"Data queries should always specify fields to return"`
        )

        process.env.NODE_ENV = 'test'
    })
})
