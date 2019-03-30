import { queryToResourcePath } from './queryToResourcePath'
import { QueryDefinition } from '../types/Query'

describe('queryToResourcePath', () => {
    it('should return resource name with now querystring if not query parameters are passed', () => {
        const query: QueryDefinition = {
            resource: 'test',
        }
        expect(queryToResourcePath(query)).toBe('test')
    })
    it('should return resource name and singular parameter separated by ?', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 'value',
        }
        expect(queryToResourcePath(query)).toBe('test?key=value')
    })
    it('should return resource name and multiple parameters separated by ? and &', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 'value',
            param: 'value2',
        }
        expect(queryToResourcePath(query)).toBe('test?key=value&param=value2')
    })
    it('should url encode special characters in query keys', () => {
        const query: QueryDefinition = {
            resource: 'test',
            'key=42&val': 'value',
        }
        expect(queryToResourcePath(query)).toBe('test?key%3D42%26val=value')
    })
    it('should url encode special characters in string parameters', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 'value?=42',
            param: 'value2&& 53',
        }
        expect(queryToResourcePath(query)).toBe(
            'test?key=value%3F%3D42&param=value2%26%26%2053'
        )
    })
    it('should support numeric (integer and float) parameters', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: 42,
            param: 193.75,
        }
        expect(queryToResourcePath(query)).toBe('test?key=42&param=193.75')
    })
    it('should join array parameters with commas', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: ['asdf', 123],
        }
        expect(queryToResourcePath(query)).toBe('test?key=asdf,123')
    })
    it('should NOT YET support name-aliased parameters', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: { asdf: 'fdsa' },
        }
        expect(() => queryToResourcePath(query)).toThrow()
    })
    it('should throw if passed something crazy like a function', () => {
        const query: QueryDefinition = {
            resource: 'test',
            key: ((a: any) => a) as any,
        }
        expect(() => queryToResourcePath(query)).toThrow()
    })
})
