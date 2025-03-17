import {
    isReplyToMessageConversation,
    isCreateFeedbackMessage,
    isCreateInterpretation,
    isUpdateInterpretation,
    isCommentOnInterpretation,
    isInterpretationCommentUpdate,
    isAddOrUpdateSystemOrUserSetting,
    addOrUpdateConfigurationProperty,
    isMetadataPackageInstallation,
    isExpressionDescriptionValidation,
    isFilterDescriptionValidation,
} from './textPlainMatchers'

describe('isReplyToMessageConversation', () => {
    it('retuns true for POST to `messageConversations/${id}`', () => {
        expect(
            isReplyToMessageConversation('create', {
                resource: 'messageConversations/oXD88WWSQpR',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isReplyToMessageConversation('create', {
                resource: 'test/oXD88WWSQpR',
            })
        ).toBe(false)
    })
})

describe('isCreateFeedbackMessage', () => {
    it('returns true for a POST to "messageConversations/feedback"', () => {
        expect(
            isCreateFeedbackMessage('create', {
                resource: 'messageConversations/feedback',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isCreateFeedbackMessage('create', {
                resource: 'messageConversations/somethingelse',
            })
        ).toBe(false)
    })
})

describe('isCreateInterpretation', () => {
    it('returns true for a POST to "interpretations/chart/${id}"', () => {
        expect(
            isCreateInterpretation('create', {
                resource: 'interpretations/chart/oXD88WWSQpR',
            })
        ).toBe(true)
    })
    it('returns false for a PUT to "interpretations/chart/${id}"', () => {
        expect(
            isCreateInterpretation('replace', {
                resource: 'interpretations/chart/oXD88WWSQpR',
            })
        ).toBe(false)
    })
    it('retuns false for PATCH requests with a valid query', () => {
        expect(
            isCreateInterpretation('update', {
                resource: 'interpretations/chart/oXD88WWSQpR',
            })
        ).toBe(false)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isCreateInterpretation('create', {
                resource: 'interpretations/dummy/oXD88WWSQpR',
            })
        ).toBe(false)
    })
})

describe('isUpdateInterpretation', () => {
    it('returns true for a PUT to "interpretations/${id}"', () => {
        expect(
            isUpdateInterpretation('replace', {
                resource: 'interpretations/oXD88WWSQpR',
            })
        ).toBe(true)
    })
    it('returns true for PUT with populated query.id', () => {
        expect(
            isUpdateInterpretation('replace', {
                resource: 'interpretations',
                id: 'oXD88WWSQpR',
            })
        ).toBe(true)
    })
    it('returns false for a POST to "interpretations/${id}"', () => {
        expect(
            isUpdateInterpretation('create', {
                resource: 'interpretations/oXD88WWSQpR',
            })
        ).toBe(false)
    })
    it('returns false for a PATCH to "interpretations/${id}"', () => {
        expect(
            isUpdateInterpretation('update', {
                resource: 'interpretations/oXD88WWSQpR',
            })
        ).toBe(false)
    })
    it('returns false for PATCH with populated query.id', () => {
        expect(
            isUpdateInterpretation('update', {
                resource: 'interpretations',
                id: 'oXD88WWSQpR',
            })
        ).toBe(false)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isUpdateInterpretation('create', {
                resource: 'interpretations/dummy/oXD88WWSQpR',
            })
        ).toBe(false)
    })
})

describe('isCommentOnInterpretation', () => {
    it('retuns true for POST to `interpretations/${id}/comments`', () => {
        expect(
            isCommentOnInterpretation('create', {
                resource: 'interpretations/oXD88WWSQpR/comments',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isCommentOnInterpretation('create', {
                resource: 'test/oXD88WWSQpR/comments',
            })
        ).toBe(false)
    })
})

describe('isInterpretationCommentUpdate', () => {
    it('returns true for a PUT to `interpretations/${interpretationId}/comments/${commentId}`', () => {
        expect(
            isInterpretationCommentUpdate('replace', {
                resource: 'interpretations/oXD88WWSQpR/comments/oXD88WWSQpR',
            })
        ).toBe(true)
    })
    it('returns true for PUT with populated query.id', () => {
        expect(
            isInterpretationCommentUpdate('replace', {
                resource: 'interpretations',
                id: 'oXD88WWSQpR/comments/oXD88WWSQpR',
            })
        ).toBe(true)
        expect(
            isInterpretationCommentUpdate('replace', {
                resource: 'interpretations/oXD88WWSQpR/comments',
                id: 'oXD88WWSQpR',
            })
        ).toBe(true)
    })
    it('retuns false for PATCH requests with a valid query', () => {
        expect(
            isInterpretationCommentUpdate('update', {
                resource: 'interpretations/oXD88WWSQpR/comments/oXD88WWSQpR',
            })
        ).toBe(false)
    })
    it('returns false for a request to a different resource', () => {
        expect(
            isInterpretationCommentUpdate('create', {
                resource: 'interpretations/oXD88WWSQpR/dummy/oXD88WWSQpR',
            })
        ).toBe(false)
    })
})

describe('isAddOrUpdateSystemOrUserSetting', () => {
    it('retuns true for POST to `systemSettings/${settingKey}`', () => {
        expect(
            isAddOrUpdateSystemOrUserSetting('create', {
                resource: 'systemSettings/keyWhatever',
            })
        ).toBe(true)
    })
    it('retuns true for POST to `userSettings/${settingKey}`', () => {
        expect(
            isAddOrUpdateSystemOrUserSetting('create', {
                resource: 'userSettings/keyWhatever',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isAddOrUpdateSystemOrUserSetting('create', {
                resource: 'test/keyWhatever',
            })
        ).toBe(false)
    })
})

describe('addOrUpdateConfigurationProperty', () => {
    it('retuns true for POST to `configuration/${property}`', () => {
        expect(
            addOrUpdateConfigurationProperty('create', {
                resource: 'configuration/whatever',
            })
        ).toBe(true)
    })
    it('retuns false for POST to `configuration/corsWhitelist`, which needs "application/json"', () => {
        expect(
            addOrUpdateConfigurationProperty('create', {
                resource: 'configuration/corsWhitelist',
            })
        ).toBe(false)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            addOrUpdateConfigurationProperty('create', {
                resource: 'test/whatever',
            })
        ).toBe(false)
    })
})

describe('isMetadataPackageInstallation', () => {
    it('returns true for a POST to "synchronization/metadataPull"', () => {
        expect(
            isMetadataPackageInstallation('create', {
                resource: 'synchronization/metadataPull',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isMetadataPackageInstallation('create', {
                resource: 'synchronization/somethingelse',
            })
        ).toBe(false)
    })
})

describe('isExpressionDescriptionValidation', () => {
    it('returns true for a POST to "indicators/expression/description"', () => {
        expect(
            isExpressionDescriptionValidation('create', {
                resource: 'indicators/expression/description',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isExpressionDescriptionValidation('create', {
                resource: 'indicators/expression/somethingelse',
            })
        ).toBe(false)
    })
    it('returns true for a POST to "programIndicators/expression/description"', () => {
        expect(
            isExpressionDescriptionValidation('create', {
                resource: 'programIndicators/expression/description',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isExpressionDescriptionValidation('create', {
                resource: 'programIndicators/expression/somethingelse',
            })
        ).toBe(false)
    })
})

describe('isFilterDescriptionValidation', () => {
    it('returns true for a POST to "programIndicators/filter/description"', () => {
        expect(
            isFilterDescriptionValidation('create', {
                resource: 'programIndicators/filter/description',
            })
        ).toBe(true)
    })
    it('retuns false for a POST to a different resource', () => {
        expect(
            isFilterDescriptionValidation('create', {
                resource: 'programIndicators/filter/somethingelse',
            })
        ).toBe(false)
    })
})
