import { QueryVariables } from '../types/Query'
import { resolveDynamicQuery } from './resolveDynamicQuery'

describe('resolveDynamicQuery', () => {
    it('Should return an unmodified query if no dynamic properties exist', () => {
        const query = {
            resource: 'test',
            resourceParams: ['123', '468'],
            id: '42',
            params: {
                page: 3,
                foo: 'bar',
            },
            data: {
                bar: 'baz',
            },
        }

        expect(resolveDynamicQuery(query, {})).toStrictEqual(query)
    })

    it('Should replace variables in all dynamic properties', () => {
        const query = {
            resource: 'test/{1}/child',
            resourceParams: ({ parent }: QueryVariables) => [parent],
            id: ({ id }: QueryVariables) => id,
            params: ({ page }: QueryVariables) => ({
                page,
                foo: 'bar',
            }),
            data: ({ bar }: QueryVariables) => ({
                bar,
            }),
        }

        const vars = {
            parent: 'trap',
            id: '42',
            page: 3,
            bar: 'baz',
        }

        expect(resolveDynamicQuery(query, vars)).toStrictEqual({
            resource: 'test/{1}/child',
            resourceParams: ['trap'],
            id: '42',
            params: {
                page: 3,
                foo: 'bar',
            },
            data: {
                bar: 'baz',
            },
        })
    })
})
