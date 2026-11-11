import { describeOrSkip, makeEngine } from './helpers'

// Unique namespace per test run so parallel runs don't collide.
const NS = `appruntime-test-${Date.now()}`

describeOrSkip('Mutations — CRUD via dataStore', () => {
    const engine = makeEngine()

    afterAll(async () => {
        try {
            await engine.mutate({
                resource: 'dataStore',
                id: NS,
                type: 'delete',
            })
        } catch {
            // Ignore: namespace may already be empty if individual deletes ran
        }
    })

    it('create — POST stores a new value and it is immediately readable', async () => {
        await engine.mutate({
            resource: `dataStore/${NS}/create-test`,
            type: 'create',
            data: { message: 'hello', count: 1 },
        })

        const result: any = await engine.query({
            entry: { resource: `dataStore/${NS}/create-test` },
        })

        expect(result.entry).toMatchObject({ message: 'hello', count: 1 })
    })

    it('replace — PUT replaces the entire value, removing omitted fields', async () => {
        await engine.mutate({
            resource: `dataStore/${NS}/replace-test`,
            type: 'create',
            data: { a: 1, b: 2 },
        })

        await engine.mutate({
            resource: 'dataStore/' + NS,
            id: 'replace-test',
            type: 'replace',
            data: { c: 3 },
        })

        const result: any = await engine.query({
            entry: { resource: `dataStore/${NS}/replace-test` },
        })

        expect(result.entry).toMatchObject({ c: 3 })
        expect(result.entry.a).toBeUndefined()
        expect(result.entry.b).toBeUndefined()
    })

    it('update — PATCH replaces the entire value (DHIS2 2.43 dataStore behaviour)', async () => {
        await engine.mutate({
            resource: `dataStore/${NS}/update-test`,
            type: 'create',
            data: { keep: 'unchanged', overwrite: 'original' },
        })

        await engine.mutate({
            resource: 'dataStore/' + NS,
            id: 'update-test',
            type: 'update',
            data: { overwrite: 'updated', added: 'new' },
        })

        const result: any = await engine.query({
            entry: { resource: `dataStore/${NS}/update-test` },
        })

        // DHIS2 2.43 dataStore PATCH replaces the entire object; prior fields not
        // included in the body are dropped (same semantics as PUT for this endpoint)
        expect(result.entry).toEqual({ overwrite: 'updated', added: 'new' })
    })

    it('delete — removes the entry; subsequent read throws', async () => {
        await engine.mutate({
            resource: `dataStore/${NS}/delete-test`,
            type: 'create',
            data: { willBeDeleted: true },
        })

        await engine.mutate({
            resource: 'dataStore/' + NS,
            id: 'delete-test',
            type: 'delete',
        })

        await expect(
            engine.query({ entry: { resource: `dataStore/${NS}/delete-test` } })
        ).rejects.toMatchObject({
            type: expect.stringMatching(/unknown|access/),
        })
    })
})

describeOrSkip('Mutations — abort signal', () => {
    it('query aborted before it fires throws a network FetchError', async () => {
        const engine = makeEngine()

        const controller = new AbortController()
        controller.abort()

        await expect(
            engine.query(
                { me: { resource: 'me' } },
                { signal: controller.signal }
            )
        ).rejects.toMatchObject({ type: 'network' })
    })

    it('in-flight query aborted mid-request throws a network FetchError', async () => {
        const engine = makeEngine()
        const controller = new AbortController()

        const abortTimer = setTimeout(() => controller.abort(), 5)

        try {
            await expect(
                engine.query(
                    {
                        dataElements: {
                            resource: 'dataElements',
                            params: { fields: ':all', paging: false },
                        },
                    },
                    { signal: controller.signal }
                )
            ).rejects.toMatchObject({ type: 'network' })
        } finally {
            clearTimeout(abortTimer)
        }
    })
})
