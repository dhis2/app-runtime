import { queryToResourceUrl } from './queryToResourceUrl'
import { QueryDefinition } from '../types/Query'
import { ContextType } from '../types/Context'

const baseUrl = '<base>'
const apiVersion = 42
const apiUrl = '<api>'
const context: ContextType = {
    baseUrl,
    apiVersion,
    apiUrl,
    fetch: async () => ({}),
}

const actionPrefix = `${baseUrl}/dhis-web-commons/`
const actionPostfix = '.action'

describe('queryToResourceUrl', () => {
    describe('action', () => {
        it('should return action URL with no querystring if not query parameters are passed', () => {
            const query: QueryDefinition = {
                resource: 'action::test',
            }
            expect(queryToResourceUrl(query, context)).toBe(
                `${actionPrefix}test${actionPostfix}`
            )
        })
        it('should return action URL with a simple querystring if query parameters are passed', () => {
            const query: QueryDefinition = {
                resource: 'action::test',
                key: 'value',
            }
            expect(queryToResourceUrl(query, context)).toBe(
                `${actionPrefix}test${actionPostfix}?key=value`
            )
        })
    })
    it('should return resource url with no querystring if not query parameters are passed', () => {
        const query: QueryDefinition = {
            resource: 'test',
        }
        expect(queryToResourceUrl(query, context)).toBe(`${apiUrl}/test`)
    })
    it('should return resource url and singular parameter separated by ?', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 'value',
        }
        expect(queryToResourceUrl(query, context)).toBe(
            `${apiUrl}/test?key=value`
        )
    })
    it('should return resource url and multiple parameters separated by ? and &', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 'value',
            param: 'value2',
        }
        expect(queryToResourceUrl(query, context)).toBe(
            `${apiUrl}/test?key=value&param=value2`
        )
    })
    it('should url encode special characters in query keys', () => {
        const query: QueryDefinition = {
            resource: 'test',
            'key=42&val': 'value',
        }
        expect(queryToResourceUrl(query, context)).toBe(
            `${apiUrl}/test?key%3D42%26val=value`
        )
    })
    it('should url encode special characters in string parameters', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 'value?=42',
            param: 'value2&& 53',
        }
        expect(queryToResourceUrl(query, context)).toBe(
            `${apiUrl}/test?key=value%3F%3D42&param=value2%26%26%2053`
        )
    })
    it('should support numeric (integer and float) parameters', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 42,
            param: 193.75,
        }
        expect(queryToResourceUrl(query, context)).toBe(
            `${apiUrl}/test?key=42&param=193.75`
        )
    })
    it('should join array parameters with commas', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: ['asdf', 123],
        }
        expect(queryToResourceUrl(query, context)).toBe(
            `${apiUrl}/test?key=asdf,123`
        )
    })
    it('should NOT YET support name-aliased parameters', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: { asdf: 'fdsa' },
        }
        expect(() => queryToResourceUrl(query, context)).toThrow()
    })
    it('should throw if passed something crazy like a function', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: ((a: any) => a) as any,
        }
        expect(() => queryToResourceUrl(query, context)).toThrow()
    })
})
