import type { Config } from '@dhis2/app-service-config'
import { ResolvedResourceQuery } from '../../engine'
import { RestAPILink } from '../RestAPILink'
import { queryToResourcePath } from './queryToResourcePath'

const createLink = (config: Config) => new RestAPILink(config)
const defaultConfig: Config = {
    basePath: '<base>',
    apiVersion: '37',
    serverVersion: {
        major: 2,
        minor: 37,
        patch: 11,
    },
} as unknown as Config

const link = createLink(defaultConfig)
const apiPath = link.versionedApiPath

const actionPrefix = `dhis-web-commons/`
const actionPostfix = '.action'

describe('queryToResourcePath', () => {
    describe('action', () => {
        it('should return action URL with no querystring if not query parameters are passed', () => {
            const query: ResolvedResourceQuery = {
                resource: 'action::test',
            }
            expect(queryToResourcePath(link, query, 'read')).toBe(
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
            expect(queryToResourcePath(link, query, 'read')).toBe(
                `${actionPrefix}test${actionPostfix}?key=value`
            )
        })
    })
    describe('resource with dot', () => {
        it('should leave dots in resources', () => {
            const query: ResolvedResourceQuery = {
                resource: 'svg.pdf',
            }
            expect(queryToResourcePath(link, query, 'read')).toBe(
                `${apiPath}/svg.pdf`
            )
        })
    })
    it('should return resource url with no querystring if not query parameters are passed', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(`${apiPath}/test`)
    })
    it('should return resource url and singular parameter separated by ?', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: 'value',
            },
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(
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
        expect(queryToResourcePath(link, query, 'read')).toBe(
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
        expect(queryToResourcePath(link, query, 'read')).toBe(
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
        expect(queryToResourcePath(link, query, 'read')).toBe(
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
        expect(queryToResourcePath(link, query, 'read')).toBe(
            `${apiPath}/test?key=42&param=193.75`
        )
    })
    it('should support boolean parameters', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: 42,
                someflag: true,
            },
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(
            `${apiPath}/test?key=42&someflag=true`
        )
    })
    it('should join array parameters with commas', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: ['asdf', 123],
            },
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(
            `${apiPath}/test?key=asdf,123`
        )
    })
    it('should include multiple filter parameters when array of filters provided', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                filter: ['asdf', 123],
            },
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(
            `${apiPath}/test?filter=asdf&filter=123`
        )
    })
    it('should NOT YET support name-aliased parameters', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: { asdf: 'fdsa' },
            },
        }
        expect(() => queryToResourcePath(link, query, 'read')).toThrow()
    })
    it('should throw if passed something crazy like a function', () => {
        const query: ResolvedResourceQuery = {
            resource: 'test',
            params: {
                key: ((a: any) => a) as any,
            },
        }
        expect(() => queryToResourcePath(link, query, 'read')).toThrow()
    })

    it('should return an unversioned endpoint for the new tracker importer (in version 2.37)', () => {
        const query: ResolvedResourceQuery = {
            resource: 'tracker',
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(
            `${link.unversionedApiPath}/tracker`
        )
    })

    it('should return an unversioned endpoint sub-resources of the new tracker importer (in version 2.37)', () => {
        const query: ResolvedResourceQuery = {
            resource: 'tracker/test',
        }
        expect(queryToResourcePath(link, query, 'read')).toBe(
            `${link.unversionedApiPath}/tracker/test`
        )
    })

    it('should return a VERSIONED endpoint for the new tracker importer (in version 2.38)', () => {
        const query: ResolvedResourceQuery = {
            resource: 'tracker',
        }
        const v38config: Config = {
            ...defaultConfig,
            serverVersion: {
                major: 2,
                minor: 38,
                patch: 0,
            },
        } as Config
        expect(queryToResourcePath(createLink(v38config), query, 'read')).toBe(
            `${link.versionedApiPath}/tracker`
        )
    })
})
