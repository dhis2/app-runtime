import {
    fileResourceUpload,
    isStaticContentUpload,
} from './multipartFormDataMatchers'

describe('fileResourceUpload', () => {
    it('returns true for a POST to "fileResources"', () => {
        expect(
            fileResourceUpload('create', {
                resource: 'fileResources',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            fileResourceUpload('create', {
                resource: 'notFileResources',
            })
        ).toEqual(false)
    })
})

describe('isStaticContentUpload', () => {
    it('returns true for a POST to "staticContent/logo_banner"', () => {
        expect(
            isStaticContentUpload('create', {
                resource: 'staticContent/logo_banner',
            })
        ).toEqual(true)
    })
    it('returns true for a POST to "staticContent/logo_front"', () => {
        expect(
            isStaticContentUpload('create', {
                resource: 'staticContent/logo_front',
            })
        ).toEqual(true)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isStaticContentUpload('create', {
                resource: 'staticContent/no_logo',
            })
        ).toEqual(false)
    })
})
