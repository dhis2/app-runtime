import { describeOrSkip, makeEngine } from './helpers'

describeOrSkip('DataEngine — integration', () => {
    it('queries current user and system info in a single call', async () => {
        const engine = makeEngine()

        const result: any = await engine.query({
            me: { resource: 'me' },
            systemInfo: { resource: 'system/info' },
        })

        expect(result.me.username).toBe('admin')
        expect(result.me.id).toMatch(/^[a-zA-Z0-9]{11}$/)

        expect(result.systemInfo.version).toMatch(/^2\.43/)
        expect(result.systemInfo.contextPath).toBe('http://localhost')
    })

    it('fetches a paginated metadata collection', async () => {
        const engine = makeEngine()

        const result: any = await engine.query({
            dataElements: {
                resource: 'dataElements',
                params: { fields: 'id,displayName', pageSize: 5 },
            },
        })

        expect(Array.isArray(result.dataElements.dataElements)).toBe(true)
        expect(result.dataElements.dataElements.length).toBeLessThanOrEqual(5)
        expect(result.dataElements.pager).toMatchObject({
            page: 1,
            pageSize: 5,
        })
    })

    it('resolves parallel queries independently', async () => {
        const engine = makeEngine()

        const [r1, r2]: any[] = await Promise.all([
            engine.query({
                me: { resource: 'me', params: { fields: 'id,username' } },
            }),
            engine.query({
                orgunits: {
                    resource: 'organisationUnits',
                    params: { fields: 'id', pageSize: 1 },
                },
            }),
        ])

        expect(r1.me.username).toBe('admin')
        expect(Array.isArray(r2.orgunits.organisationUnits)).toBe(true)
    })

    it('applies field restrictions and returns only requested fields', async () => {
        const engine = makeEngine()

        const result: any = await engine.query({
            users: {
                resource: 'users',
                params: { fields: 'id,username', pageSize: 3 },
            },
        })

        const users: any[] = result.users.users
        expect(users.length).toBeGreaterThan(0)

        for (const user of users) {
            expect(user).toHaveProperty('id')
            expect(user).toHaveProperty('username')
            expect(user.firstName).toBeUndefined()
        }
    })

    it('throws a typed FetchError on a bad resource path', async () => {
        const engine = makeEngine()

        await expect(
            engine.query({ x: { resource: 'nonexistent/resource/path' } })
        ).rejects.toMatchObject({ type: 'unknown' })
    })
})
