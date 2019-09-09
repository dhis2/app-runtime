import { ResolvedResourceQuery } from '../../../types/Query'
import { queryToResourcePath } from './queryToResourcePath'

const apiPath = '<api>'

const actionPrefix = `dhis-web-commons/`
const actionPostfix = '.action'

describe('queryToResourcePath', () => {
    describe('action', () => {
        it('should return action URL with no querystring if not query parameters are passed', () => {
            const query: ResolvedResourceQuery = {
                resource: 'action::test',
            }
            expect(queryToResourcePath(apiPath, query)).toBe(
                `${actionPrefix}test${actionPostfix}`
            )
        })
        it('should return action URL with a simple querystring if query parameters are passed', () => {
            const query: ResolvedResourceQuery = {
                resource: 'action::test',
                params: {
                    key: 'value',
                },
            }
            expect(queryToResourcePath(apiPath, query)).toBe(
                `${actionPrefix}test${actionPostfix}?key=value`
            )
        })
    })
    it('should return resource url with no querystring if not query parameters are passed', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
        }
        expect(queryToResourcePath(apiPath, query)).toBe(`${apiPath}/test`)
    })
    it('should return resource url and singular parameter separated by ?', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: 'value',
            },
        }
        expect(queryToResourcePath(apiPath, query)).toBe(
            `${apiPath}/test?key=value`
        )
    })
    it('should return resource url and multiple parameters separated by ? and &', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: 'value',
                param: 'value2',
            },
        }
        expect(queryToResourcePath(apiPath, query)).toBe(
            `${apiPath}/test?key=value&param=value2`
        )
    })
    it('should url encode special characters in query keys', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                'key=42&val': 'value',
            },
        }
        expect(queryToResourcePath(apiPath, query)).toBe(
            `${apiPath}/test?key%3D42%26val=value`
        )
    })
    it('should url encode special characters in string parameters', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: 'value?=42',
                param: 'value2&& 53',
            },
        }
        expect(queryToResourcePath(apiPath, query)).toBe(
            `${apiPath}/test?key=value%3F%3D42&param=value2%26%26%2053`
        )
    })
    it('should support numeric (integer and float) parameters', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: 42,
                param: 193.75,
            },
        }
        expect(queryToResourcePath(apiPath, query)).toBe(
            `${apiPath}/test?key=42&param=193.75`
        )
    })
    it('should join array parameters with commas', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: ['asdf', 123],
            },
        }
        expect(queryToResourcePath(apiPath, query)).toBe(
            `${apiPath}/test?key=asdf,123`
        )
    })
    it('should NOT YET support name-aliased parameters', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: { asdf: 'fdsa' },
            },
        }
        expect(() => queryToResourcePath(apiPath, query)).toThrow()
    })
    it('should throw if passed something crazy like a function', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: ((a: any) => a) as any,
            },
        }
        expect(() => queryToResourcePath(apiPath, query)).toThrow()
    })
})
