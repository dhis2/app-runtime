import { fetchData } from './fetchData'
import { LRUCache } from '../../helpers/LRUCache'

const ALIAS_NOT_FOUND_MESSAGE =
    'No query alias found with this hash id, it may have expired.'

type FetchRefs = {
    queryAliasCache: any
    config: any
}

const makeResponse = (
    body: any,
    status = 200,
    statusText = '',
    contentType = 'application/json'
) => ({
    status,
    statusText,
    headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? contentType : null) },
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    blob: async () => body,
})

describe('fetchData - query alias creation and caching', () => {
    const baseUrl = 'http://example.com'
    const apiVersion = 34
    const longUrl = `${baseUrl}/very/long/query?with=params&that=make&the=uri&long`
    const aliasEndpoint = `${baseUrl}/api/${apiVersion}/query/alias`

    let refs: FetchRefs
    let aliasCreateCalls = 0
    let aliasExpired = false

    beforeEach(() => {
        jest.clearAllMocks()
        aliasCreateCalls = 0
        aliasExpired = false

        refs = {
            queryAliasCache: new LRUCache<string, any>(10),
            config: {
                baseUrl,
                apiVersion,
                apiToken: undefined,
            },
        }
    })

    it('creates an alias on 414 and uses the alias href', async () => {
        const data = { result: 123 }

        const alias1 = {
            id: 'alias-1',
            path: '/alias/1',
            href: `${baseUrl}/alias/1`,
            target: longUrl,
        }

        // mock fetch to simulate sequence:
        // 1) initial long url -> 414
        // 2) POST to alias endpoint -> returns alias object
        // 3) fetch alias.href -> returns data
        ;(global as any).fetch = jest.fn(async (reqUrl: string, reqInit: any) => {
            if (reqUrl === longUrl) {
                return makeResponse(null, 414, 'URI Too Long')
            }

            if (reqUrl === aliasEndpoint) {
                aliasCreateCalls += 1
                return makeResponse(alias1, 200, 'OK')
            }

            if (reqUrl === alias1.href) {
                return makeResponse(data, 200, 'OK')
            }

            return makeResponse(null, 500, 'Unknown')
        })

        const result = await fetchData(longUrl, { method: 'GET' }, refs as any)

        expect(result).toEqual(data)
        expect(refs.queryAliasCache.get(longUrl)).toMatchObject(alias1)
        expect(aliasCreateCalls).toBe(1)
    })

    it('reuses cached alias until server reports it expired, then recreates and caches a new alias', async () => {
        const dataA = { result: 'A' }
        const dataB = { result: 'B' }

        const alias1 = {
            id: 'alias-1',
            path: '/alias/1',
            href: `${baseUrl}/alias/1`,
            target: longUrl,
        }

        const alias2 = {
            id: 'alias-2',
            path: '/alias/2',
            href: `${baseUrl}/alias/2`,
            target: longUrl,
        }

        // track how many times alias endpoint is called and return alias1 then alias2
        aliasCreateCalls = 0

        ;(global as any).fetch = jest.fn(async (reqUrl: string, reqInit: any) => {
            // If the original long URL is called, simulate 414 (only on first-run scenarios)
            if (reqUrl === longUrl) {
                return makeResponse(null, 414, 'URI Too Long')
            }

            // Alias creation endpoint
            if (reqUrl === aliasEndpoint) {
                aliasCreateCalls += 1
                return makeResponse(aliasCreateCalls === 1 ? alias1 : alias2, 200, 'OK')
            }

            // Calls to alias href - if aliasExpired flag is set, simulate 404 with special statusText
            if (reqUrl === alias1.href || reqUrl === alias2.href) {
                const isAlias1 = reqUrl === alias1.href
                if (isAlias1 && aliasExpired) {
                    return makeResponse(null, 404, ALIAS_NOT_FOUND_MESSAGE)
                }

                // Return data depending on which alias
                return makeResponse(isAlias1 ? dataA : dataB, 200, 'OK')
            }

            return makeResponse(null, 500, 'Unknown')
        })

        // First request: will trigger alias creation (alias1) and return dataA
        const r1 = await fetchData(longUrl, { method: 'GET' }, refs as any)
        expect(r1).toEqual(dataA)
        expect(refs.queryAliasCache.get(longUrl)).toMatchObject(alias1)
        expect(aliasCreateCalls).toBe(1)

        // Second request: should reuse cached alias1 and return same dataA
        const r2 = await fetchData(longUrl, { method: 'GET' }, refs as any)
        expect(r2).toEqual(dataA)
        // alias creation should not have been called again
        expect(aliasCreateCalls).toBe(1)

        // Simulate server evicting alias1
        aliasExpired = true

        // Third request: fetch to alias1.href will return 404 with special message, forcing recreate
        const r3 = await fetchData(longUrl, { method: 'GET' }, refs as any)
        // After recreation, should return data from alias2
        expect(r3).toEqual(dataB)
        // alias creation should have been called a second time
        expect(aliasCreateCalls).toBe(2)
        // cached alias should now be alias2
        expect(refs.queryAliasCache.get(longUrl)).toMatchObject(alias2)
    })
})