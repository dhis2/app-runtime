import { parseVersionString, versionCompare } from './versionCompare'

describe('parseVersionString', () => {
    it('Should correctly return [null] for an empty string', () => {
        expect(parseVersionString('')).toMatchObject([null])
    })

    it('Should correctly parse a valid 1-part version', () => {
        expect(parseVersionString('2')).toMatchObject([2])
    })
    it('Should correctly parse a valid 2-part version', () => {
        expect(parseVersionString('2.36')).toMatchObject([2, 36])
    })
    it('Should correctly parse a valid 3-part version', () => {
        expect(parseVersionString('2.34.5')).toMatchObject([2, 34, 5])
    })

    it('Should correctly parse a version with tag suffix', () => {
        expect(parseVersionString('2.36.10-beta.3')).toMatchObject([
            2,
            36,
            10,
            null,
            3,
        ])
    })
})

describe('versionCompare', () => {
    it('Should correctly return 0 if a is equal to b', () => {
        expect(versionCompare('2.32', '2.32')).toBe(0)
        expect(versionCompare('2.34.6', '2.34.6')).toBe(0)
        expect(versionCompare('2', '2')).toBe(0)
        expect(versionCompare('2.36.10-beta.3', '2.36.10-beta.3')).toBe(0)
    })
    it('Should correctly return -1 if a is less than b', () => {
        expect(versionCompare('1', '2')).toBe(-1)
        expect(versionCompare('1.35', '2.35')).toBe(-1)
        expect(versionCompare('2.32', '2.35')).toBe(-1)
        expect(versionCompare('2.32.6', '2.35.3')).toBe(-1)
        expect(versionCompare('2.35.3', '2.35.6')).toBe(-1)
    })

    it('Should correctly return 1 if a is greater than b', () => {
        expect(versionCompare('2', '1')).toBe(1)
        expect(versionCompare('2.35', '1.35')).toBe(1)
        expect(versionCompare('2.35', '2.32')).toBe(1)
        expect(versionCompare('2.35.3', '2.32.6')).toBe(1)
        expect(versionCompare('2.35.6', '2.35.3')).toBe(1)
    })

    it('Should correctly handle postfixed versions', () => {
        expect(versionCompare('2.36.10-beta.3', '2.36.10.0.3')).toBe(-1)
        expect(versionCompare('2.36.10-beta.3', '2.36.10-beta.5')).toBe(-1)
    })
})
