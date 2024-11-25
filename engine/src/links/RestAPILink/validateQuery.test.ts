import { validateResourceQuery } from './validateQuery'

describe('validateQuery', () => {
    const originalConsoleWarn = console.warn
    afterAll(() => {
        console.warn = originalConsoleWarn
    })
    it('Should return true and NOT console.warn for a valid query', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                { resource: 'indicators', params: { fields: 'name' } },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()
        expect(
            validateResourceQuery(
                {
                    resource: 'users',
                    params: { fields: ['name', 'id'], pageSize: 35, page: 2 },
                },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()
        expect(
            validateResourceQuery(
                {
                    resource: 'userGroups',
                    params: {
                        fields: ['name', 'shortName'],
                        paging: true,
                        pageSize: 20,
                    },
                },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()
    })

    it('Should return true for mutations', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                {
                    resource: 'trackedEntityInstances',
                    params: { paging: false },
                },
                'create'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        expect(
            validateResourceQuery({ resource: 'visualizations' }, 'update')
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        expect(validateResourceQuery({ resource: 'maps' }, 'delete')).toBe(true)
        expect(warn).not.toHaveBeenCalled()
    })

    it('Should skip validation for non-normative and non-metadata resources', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                { resource: 'analytics', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        expect(
            validateResourceQuery(
                { resource: 'dataStore', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        expect(
            validateResourceQuery(
                { resource: 'icons', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        expect(
            validateResourceQuery(
                { resource: 'apps', params: { fields: ['*'] } },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        process.env.NODE_ENV = 'test'
    })

    it('Should return true and not warn in production mode', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'production'

        expect(
            validateResourceQuery(
                {
                    resource: 'programTrackedEntityAttributeGroups',
                    params: { fields: ['*'] },
                },
                'read'
            )
        ).toBe(true)
        expect(warn).not.toHaveBeenCalled()

        process.env.NODE_ENV = 'test'
    })

    it('Should return false and warn in development mode', () => {
        const warn = (console.warn = jest.fn())
        process.env.NODE_ENV = 'development'

        expect(
            validateResourceQuery(
                { resource: 'dataElements', params: { fields: ['*'] } },
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

        expect(validateResourceQuery({ resource: 'mapViews' }, 'read')).toBe(
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
                    resource: 'attributes',
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
                    resource: 'optionSets',
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
                { resource: 'categoryOptionCombos', params: { fields: ['*'] } },
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
                    resource: 'organisationUnits',
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
                    resource: 'organisationUnitGroups',
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
                    resource: 'dashboards',
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
                    resource: 'dataSets',
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
                    resource: 'dashboardItems',
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
