import { DataEngine } from '../engine'
import { CustomDataLink } from '../links'
import { InMemoryCache } from './InMemoryCache'

describe('InMemoryCache', () => {
    describe('Query', () => {
        let fooData, data
        const fooQuery = { foo: { resource: 'foo' } }
        const barQuery = {
            bar: {
                resource: 'bar',
                params: ({ bar }) => ({ bar }),
            },
        }

        beforeEach(() => {
            fooData = [1, 2, 3]
            data = {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                foo: (type, query) => Promise.resolve(fooData.shift()),

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                bar: (type, query) => {
                    if (query.params?.bar) return 'bar'
                    return 'nobar'
                },
            }
        })

        it('should return 1 when never requested resource', async () => {
            const link = new CustomDataLink(data)
            const cache = new InMemoryCache()
            const engine = new DataEngine(link, cache)

            const result = await engine.query(fooQuery)
            expect(result).toEqual({ foo: 1 })
        })

        it('should use a cached result when querying the same resource', async () => {
            const link = new CustomDataLink(data)
            const cache = new InMemoryCache()
            const engine = new DataEngine(link, cache)

            await engine.query(fooQuery)
            const result = await engine.query(fooQuery)
            expect(result).toEqual({ foo: 1 })
        })

        it('should get the next value when invalidating the cache', async () => {
            const link = new CustomDataLink(data)
            const cache = new InMemoryCache()
            const engine = new DataEngine(link, cache)

            await engine.query(fooQuery)
            const result1 = await engine.query(fooQuery)
            expect(result1).toEqual({ foo: 1 })

            const result2 = await engine.query(fooQuery, {
                invalidateCache: true,
            })
            expect(result2).toEqual({ foo: 2 })
        })

        it('should not use a cached result when querying the same resource with different variables', async () => {
            const link = new CustomDataLink(data)
            const cache = new InMemoryCache()
            const engine = new DataEngine(link, cache)

            const result1 = await engine.query(barQuery, {
                variables: { bar: true },
            })
            expect(result1).toEqual({ bar: 'bar' })

            const result2 = await engine.query(barQuery, {
                variables: { bar: false },
            })
            expect(result2).toEqual({ bar: 'nobar' })
        })
    })
})
