import { isSvgConversion } from './xWwwFormUrlencodedMatchers'

describe('isSvgConversion', () => {
    it('returns true for a POST to "svg.png"', () => {
        expect(
            isSvgConversion('create', {
                resource: 'svg.png',
            })
        ).toEqual(true)
    })
    it('returns true for a POST to "svg.pdf"', () => {
        expect(
            isSvgConversion('create', {
                resource: 'svg.pdf',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isSvgConversion('create', {
                resource: 'notSvg',
            })
        ).toEqual(false)
    })
})
