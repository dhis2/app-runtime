import { stableValueHash } from './stableValueHash'

describe('stableValueHash', () => {
    it('sorts objects before hashing', () => {
        const one = {
            a: {
                one: 1,
                two: 2,
                three: 3,
            },
            b: [1, 2, 3],
            c: 'c',
        }
        const two = {
            c: 'c',
            b: [1, 2, 3],
            a: {
                three: 3,
                two: 2,
                one: 1,
            },
        }

        expect(stableValueHash(one)).toEqual(stableValueHash(two))
    })

    it('can handle primitives', () => {
        const one = undefined
        const two = 'string'
        const three = 3
        const four = null
        const five = true

        expect(stableValueHash(one)).toMatchInlineSnapshot(`undefined`)
        expect(stableValueHash(two)).toMatchInlineSnapshot(`"\\"string\\""`)
        expect(stableValueHash(three)).toMatchInlineSnapshot(`"3"`)
        expect(stableValueHash(four)).toMatchInlineSnapshot(`"null"`)
        expect(stableValueHash(five)).toMatchInlineSnapshot(`"true"`)
    })
})
