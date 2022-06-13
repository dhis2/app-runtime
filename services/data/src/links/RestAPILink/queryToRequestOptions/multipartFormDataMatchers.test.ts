import {
    isFileResourceUpload,
    isMessageConversationAttachment,
    isStaticContentUpload,
    isAppInstall,
    isDataValue,
} from './multipartFormDataMatchers'

describe('isDataValue', () => {
    it('returns true for a POST to "dataValues"', () => {
        expect(isDataValue('create', { resource: 'dataValues' })).toBe(true)
    })
    it('returns true for a POST to "dataValues/file"', () => {
        expect(isDataValue('create', { resource: 'dataValues/file' })).toBe(
            true
        )
    })
    it('returns false for a POST to a different resource', () => {
        expect(isDataValue('create', { resource: 'somethingElse' })).toBe(false)
    })
})

describe('isFileResourceUpload', () => {
    it('returns true for a POST to "fileResources"', () => {
        expect(
            isFileResourceUpload('create', {
                resource: 'fileResources',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isFileResourceUpload('create', {
                resource: 'notFileResources',
            })
        ).toBe(false)
    })
})

describe('isMessageConversationAttachment', () => {
    it('returns true for a POST to "messageConversations/attachments"', () => {
        expect(
            isMessageConversationAttachment('create', {
                resource: 'messageConversations/attachments',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isMessageConversationAttachment('create', {
                resource: 'messageConversations/notAttachments',
            })
        ).toBe(false)
    })
})

describe('isStaticContentUpload', () => {
    it('returns true for a POST to "staticContent/logo_banner"', () => {
        expect(
            isStaticContentUpload('create', {
                resource: 'staticContent/logo_banner',
            })
        ).toBe(true)
    })
    it('returns true for a POST to "staticContent/logo_front"', () => {
        expect(
            isStaticContentUpload('create', {
                resource: 'staticContent/logo_front',
            })
        ).toBe(true)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isStaticContentUpload('create', {
                resource: 'staticContent/no_logo',
            })
        ).toBe(false)
    })
})

describe('isAppInstall', () => {
    it('returns true for a POST to "apps"', () => {
        expect(
            isAppInstall('create', {
                resource: 'apps',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isAppInstall('create', {
                resource: 'notApps',
            })
        ).toBe(false)
    })
})
