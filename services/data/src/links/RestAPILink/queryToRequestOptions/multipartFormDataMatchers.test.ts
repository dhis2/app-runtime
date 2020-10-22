import {
    isFileResourceUpload,
    isMessageConversationAttachment,
    isStaticContentUpload,
    isAppInstall,
} from './multipartFormDataMatchers'

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
    it('returns true for a POST to "fileResources"', () => {
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
