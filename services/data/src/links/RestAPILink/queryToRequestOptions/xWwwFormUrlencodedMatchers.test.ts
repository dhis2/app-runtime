import { isSvgConversion } from './xWwwFormUrlencodedMatchers'

describe('isSvgConversion', () => {
    it('returns true for a POST to "svg.png"', () => {
        expect(
            isSvgConversion('create', {
                resource: 'svg.png',
            })
        ).toBe(true)
    })
    it('returns true for a POST to "svg.pdf"', () => {
        expect(
            isSvgConversion('create', {
                resource: 'svg.pdf',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isSvgConversion('create', {
                resource: 'notSvg',
            })
        ).toBe(false)
    })
})
