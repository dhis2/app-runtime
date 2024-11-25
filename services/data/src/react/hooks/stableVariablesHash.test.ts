import { stableVariablesHash } from './stableVariablesHash'

describe('stableVariablesHash', () => {
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

        expect(stableVariablesHash(one)).toEqual(stableVariablesHash(two))
    })

    it('can handle primitives', () => {
        const one = undefined
        const two = 'string'
        const three = 3
        const four = null
        const five = true

        expect(stableVariablesHash(one)).toMatchInlineSnapshot(`undefined`)
        expect(stableVariablesHash(two)).toMatchInlineSnapshot(`"\\"string\\""`)
        expect(stableVariablesHash(three)).toMatchInlineSnapshot(`"3"`)
        expect(stableVariablesHash(four)).toMatchInlineSnapshot(`"null"`)
        expect(stableVariablesHash(five)).toMatchInlineSnapshot(`"true"`)
    })

    it('throws a clear error when the variables contain a circular reference', () => {
        const unserializable: any = {
            value: 'value',
        }
        unserializable.circular = unserializable

        expect(() =>
            stableVariablesHash(unserializable)
        ).toThrowErrorMatchingInlineSnapshot(
            `"Could not serialize variables. Make sure that the variables do not contain circular references and can be processed by JSON.stringify."`
        )
    })
})
