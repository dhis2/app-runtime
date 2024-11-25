import { CustomDataLink } from './CustomDataLink'

describe('CustomDataLink', () => {
    it('Should return mocked resource', async () => {
        const link = new CustomDataLink({
            foo: 'bar',
        })
        expect(
            link.executeResourceQuery('read', { resource: 'foo' }, {})
        ).resolves.toBe('bar')
    })

    it('Should throw error on mock miss', async () => {
        const link = new CustomDataLink({
            foo: 'bar',
        })
        expect(
            link.executeResourceQuery('read', { resource: 'something' }, {})
        ).rejects.toMatchInlineSnapshot(
            `[Error: No data provided for resource type something!]`
        )
    })

    it('Should swallow miss error with failOnMiss=false', async () => {
        const link = new CustomDataLink(
            {
                foo: 'bar',
            },
            {
                failOnMiss: false,
            }
        )
        expect(
            link.executeResourceQuery('read', { resource: 'something' }, {})
        ).resolves.toBe(null)
    })

    it('Should resolve functional resource', async () => {
        const link = new CustomDataLink({
            foo: async () => 'bar',
        })
        expect(
            link.executeResourceQuery('read', { resource: 'foo' }, {})
        ).resolves.toBe('bar')
    })

    it('Should throw if resolves to undefined', async () => {
        const link = new CustomDataLink({
            foo: async () => undefined,
        })
        expect(
            link.executeResourceQuery('read', { resource: 'foo' }, {})
        ).rejects.toMatchInlineSnapshot(
            `[Error: The custom function for resource foo must always return a value but returned undefined]`
        )
    })

    it('Should swallow functional miss if failOnMiss=false', async () => {
        const link = new CustomDataLink(
            {
                foo: async () => undefined,
            },
            {
                failOnMiss: false,
            }
        )
        expect(
            link.executeResourceQuery('read', { resource: 'foo' }, {})
        ).resolves.toBe(null)
    })

    it('Should wait forever with loadForever=true', async () => {
        jest.useFakeTimers()
        const link = new CustomDataLink(
            {},
            {
                loadForever: true,
            }
        )
        let done = false
        link.executeResourceQuery('read', { resource: 'foo' }, {})
            .then(() => {
                done = true
            })
            .catch(() => {
                done = true
            })

        jest.advanceTimersByTime(100)
        expect(done).toBe(false)
    })
})
