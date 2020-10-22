import {
    isReplyToMessageConversation,
    isCreateFeedbackMessage,
    isCreateOrUpdateInterpretation,
    isCommentOnInterpretation,
    isInterpretationCommentUpdate,
    isAddOrUpdateSystemOrUserSetting,
    addOrUpdateConfigurationProperty,
    isMetadataPackageInstallation,
} from './textPlainMatchers'

describe('isReplyToMessageConversation', () => {
    it('retuns true for POST to `messageConversations/${id}`', () => {
        expect(
            isReplyToMessageConversation('create', {
                resource: 'messageConversations/oXD88WWSQpR',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isReplyToMessageConversation('create', {
                resource: 'test/oXD88WWSQpR',
            })
        ).toEqual(false)
    })
})

describe('isCreateFeedbackMessage', () => {
    it('returns true for a POST to "messageConversations/feedback"', () => {
        expect(
            isCreateFeedbackMessage('create', {
                resource: 'messageConversations/feedback',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isCreateFeedbackMessage('create', {
                resource: 'messageConversations/somethingelse',
            })
        ).toEqual(false)
    })
})

describe('isCreateOrUpdateInterpretation', () => {
    it('returns true for a POST to "interpretations/chart/${id}"', () => {
        expect(
            isCreateOrUpdateInterpretation('create', {
                resource: 'interpretations/chart/oXD88WWSQpR',
            })
        ).toEqual(true)
    })
    it('returns true for a PUT to "interpretations/chart/${id}"', () => {
        expect(
            isCreateOrUpdateInterpretation('replace', {
                resource: 'interpretations/chart/oXD88WWSQpR',
            })
        ).toEqual(true)
    })
    it('returns true for PUT with populated query.id', () => {
        expect(
            isCreateOrUpdateInterpretation('replace', {
                resource: 'interpretations/chart',
                id: 'oXD88WWSQpR',
            })
        ).toEqual(true)
    })
    it('retuns false for PATCH requests with a valid query', () => {
        expect(
            isCreateOrUpdateInterpretation('update', {
                resource: 'interpretations/chart/oXD88WWSQpR',
            })
        ).toEqual(false)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isCreateOrUpdateInterpretation('create', {
                resource: 'interpretations/dummy/oXD88WWSQpR',
            })
        ).toEqual(false)
    })
})

describe('isCommentOnInterpretation', () => {
    it('retuns true for POST to `interpretations/${id}/comments`', () => {
        expect(
            isCommentOnInterpretation('create', {
                resource: 'interpretations/oXD88WWSQpR/comments',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isCommentOnInterpretation('create', {
                resource: 'test/oXD88WWSQpR/comments',
            })
        ).toEqual(false)
    })
})

describe('isInterpretationCommentUpdate', () => {
    it('returns true for a PUT to `interpretations/${interpretationId}/comments/${commentId}`', () => {
        expect(
            isInterpretationCommentUpdate('replace', {
                resource: 'interpretations/oXD88WWSQpR/comments/oXD88WWSQpR',
            })
        ).toEqual(true)
    })
    it('returns true for PUT with populated query.id', () => {
        expect(
            isInterpretationCommentUpdate('replace', {
                resource: 'interpretations',
                id: 'oXD88WWSQpR/comments/oXD88WWSQpR',
            })
        ).toEqual(true)
        expect(
            isInterpretationCommentUpdate('replace', {
                resource: 'interpretations/oXD88WWSQpR/comments',
                id: 'oXD88WWSQpR',
            })
        ).toEqual(true)
    })
    it('retuns false for PATCH requests with a valid query', () => {
        expect(
            isInterpretationCommentUpdate('update', {
                resource: 'interpretations/oXD88WWSQpR/comments/oXD88WWSQpR',
            })
        ).toEqual(false)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isInterpretationCommentUpdate('create', {
                resource: 'interpretations/oXD88WWSQpR/dummy/oXD88WWSQpR',
            })
        ).toEqual(false)
    })
})

describe('isAddOrUpdateSystemOrUserSetting', () => {
    it('retuns true for POST to `systemSettings/${settingKey}`', () => {
        expect(
            isAddOrUpdateSystemOrUserSetting('create', {
                resource: 'systemSettings/keyWhatever',
            })
        ).toEqual(true)
    })
    it('retuns true for POST to `userSettings/${settingKey}`', () => {
        expect(
            isAddOrUpdateSystemOrUserSetting('create', {
                resource: 'userSettings/keyWhatever',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isAddOrUpdateSystemOrUserSetting('create', {
                resource: 'test/keyWhatever',
            })
        ).toEqual(false)
    })
})

describe('addOrUpdateConfigurationProperty', () => {
    it('retuns true for POST to `configuration/${property}`', () => {
        expect(
            addOrUpdateConfigurationProperty('create', {
                resource: 'configuration/whatever',
            })
        ).toEqual(true)
    })
    it('retuns false for POST to `configuration/corsWhitelist`, which needs "application/json"', () => {
        expect(
            addOrUpdateConfigurationProperty('create', {
                resource: 'configuration/corsWhitelist',
            })
        ).toEqual(false)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            addOrUpdateConfigurationProperty('create', {
                resource: 'test/whatever',
            })
        ).toEqual(false)
    })
})

describe('isMetadataPackageInstallation', () => {
    it('returns true for a POST to "synchronization/metadataPull"', () => {
        expect(
            isMetadataPackageInstallation('create', {
                resource: 'synchronization/metadataPull',
            })
        ).toEqual(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isMetadataPackageInstallation('create', {
                resource: 'synchronization/somethingelse',
            })
        ).toEqual(false)
    })
})
