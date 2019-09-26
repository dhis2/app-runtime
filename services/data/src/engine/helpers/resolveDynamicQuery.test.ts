import { resolveDynamicQuery } from './resolveDynamicQuery'
import { QueryVariables } from '../types'

describe('resolveDynamicQuery', () => {
    it('Should return an unmodified query if no dynamic properties exist', () => {
        const query = {
            resource: 'test',
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
            resource: 'test',
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
            id: '42',
            page: 3,
            bar: 'baz',
        }

        expect(resolveDynamicQuery(query, vars)).toStrictEqual({
            resource: 'test',
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
