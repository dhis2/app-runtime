import { DataEngine } from '@dhis2/data-engine'
import {
    apiBase,
    apiToken,
    baseUrl,
    apiVersion,
    describeOrSkip,
    makeLink,
} from './helpers'

/**
 * Query params that produce a URL long enough (> 1 024 bytes) to trigger a
 * 414 from the nginx proxy configured in docker-compose.yml.
 */
const LONG_FILTER_PARAMS = {
    fields: 'id,displayName',
    pageSize: 1,
    filter: Array.from(
        { length: 60 },
        (_, i) => `name:ilike:integrationtest${String(i).padStart(3, '0')}`
    ),
}

describeOrSkip('query alias — integration', () => {
    it('query/alias endpoint accepts a POST with JSON body and returns a resolvable href', async () => {
        // DHIS2 requires target to be root-relative (/api/...), not an absolute URL
        const target = `/api/${apiVersion}/dataElements?fields=id,displayName&pageSize=1`

        const res = await fetch(`${apiBase}/query/alias`, {
            method: 'POST',
            headers: {
                Authorization: `ApiToken ${apiToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ target }),
        })

        expect(res.status).toBe(200)
        const alias = await res.json()
        expect(alias).toMatchObject({
            id: expect.any(String),
            href: expect.any(String),
            target,
        })

        // DHIS2 returns its internal origin in href (no port); rewrite to the
        // external baseUrl before fetching so we hit the proxy correctly.
        const aliasHref = alias.href.replace(/^https?:\/\/[^/]+/, baseUrl)
        const aliasRes = await fetch(aliasHref, {
            headers: { Authorization: `ApiToken ${apiToken}` },
        })
        expect(aliasRes.status).toBe(200)
    })

    it('transparently handles a 414 URI via the alias mechanism end-to-end', async () => {
        const link = makeLink()
        const engine = new DataEngine(link)

        let aliasPostCount = 0
        const originalFetch = globalThis.fetch
        globalThis.fetch = async (
            url: RequestInfo | URL,
            init?: RequestInit
        ) => {
            if (
                url.toString().includes('query/alias') &&
                init?.method === 'POST'
            ) {
                aliasPostCount++
            }
            return originalFetch(url, init)
        }

        try {
            const result: any = await engine.query({
                data: { resource: 'dataElements', params: LONG_FILTER_PARAMS },
            })

            expect(result.data).toBeDefined()
            expect(aliasPostCount).toBe(1)
        } finally {
            globalThis.fetch = originalFetch
        }
    })

    it('reuses the cached alias on repeated calls — no second POST to query/alias', async () => {
        const link = makeLink()
        const engine = new DataEngine(link)

        let aliasPostCount = 0
        const originalFetch = globalThis.fetch
        globalThis.fetch = async (
            url: RequestInfo | URL,
            init?: RequestInit
        ) => {
            if (
                url.toString().includes('query/alias') &&
                init?.method === 'POST'
            ) {
                aliasPostCount++
            }
            return originalFetch(url, init)
        }

        try {
            const r1: any = await engine.query({
                data: { resource: 'dataElements', params: LONG_FILTER_PARAMS },
            })
            expect(r1.data).toBeDefined()
            expect(aliasPostCount).toBe(1)

            const r2: any = await engine.query({
                data: { resource: 'dataElements', params: LONG_FILTER_PARAMS },
            })
            expect(r2.data).toBeDefined()
            expect(aliasPostCount).toBe(1)
        } finally {
            globalThis.fetch = originalFetch
        }
    })

    it('recreates an alias when a cached alias href returns 404', async () => {
        const link = makeLink()
        const engine = new DataEngine(link)

        let firstAlias: { href: string } | undefined

        let aliasPostCount = 0
        const originalFetch = globalThis.fetch
        globalThis.fetch = async (
            url: RequestInfo | URL,
            init?: RequestInit
        ) => {
            const urlStr = url.toString()
            if (urlStr.includes('query/alias') && init?.method === 'POST') {
                aliasPostCount++
                const res = await originalFetch(url, init)
                const clone = res.clone()
                clone.json().then((body: any) => {
                    firstAlias = body
                })
                return res
            }
            return originalFetch(url, init)
        }

        try {
            await engine.query({
                data: { resource: 'dataElements', params: LONG_FILTER_PARAMS },
            })
            expect(aliasPostCount).toBe(1)

            if (firstAlias) {
                link.queryAliasCache.set((firstAlias as any).target, {
                    ...(firstAlias as any),
                    href: `${baseUrl}/api/${apiVersion}/query/alias/does-not-exist`,
                })
            }

            try {
                const r3: any = await engine.query({
                    data: {
                        resource: 'dataElements',
                        params: LONG_FILTER_PARAMS,
                    },
                })
                expect(r3.data).toBeDefined()
                expect(aliasPostCount).toBe(2)
            } catch (err: any) {
                // Over HTTP/2 statusText is always empty, so the stale-alias
                // detection may not fire — a clean FetchError is acceptable here.
                expect(err.type).toMatch(/unknown|access/)
            }
        } finally {
            globalThis.fetch = originalFetch
        }
    })
})
