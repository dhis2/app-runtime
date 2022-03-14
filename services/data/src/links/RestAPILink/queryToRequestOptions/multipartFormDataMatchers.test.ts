import {
    isFileResourceUpload,
    isMessageConversationAttachment,
    isStaticContentUpload,
    isAppInstall,
    isSvgConversion,
    isDataValue,
} from './multipartFormDataMatchers'

describe('isDataValue', () => {
    it('returns true for a POST to "dataValues"', () => {
        expect(isDataValue('create', { resource: 'dataValues' })).toEqual(true)
    })
    it('returns true for a POST to "dataValues/file"', () => {
        expect(isDataValue('create', { resource: 'dataValues/file' })).toEqual(
            true
        )
    })
    it('returns false for a POST to a different resource', () => {
        expect(isDataValue('create', { resource: 'somethingElse' })).toEqual(
            false
        )
    })
})

describe('isFileResourceUpload', () => {
    it('returns true for a POST to "fileResources"', () => {
        expect(
            isFileResourceUpload('create', {
                resource: 'fileResources',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isFileResourceUpload('create', {
                resource: 'notFileResources',
            })
        ).toEqual(false)
    })
})

describe('isMessageConversationAttachment', () => {
    it('returns true for a POST to "messageConversations/attachments"', () => {
        expect(
            isMessageConversationAttachment('create', {
                resource: 'messageConversations/attachments',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isMessageConversationAttachment('create', {
                resource: 'messageConversations/notAttachments',
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

describe('isAppInstall', () => {
    it('returns true for a POST to "apps"', () => {
        expect(
            isAppInstall('create', {
                resource: 'apps',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isAppInstall('create', {
                resource: 'notApps',
            })
        ).toEqual(false)
    })
})

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
