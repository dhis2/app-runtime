import { ResolvedResourceQuery, FetchType } from '../../../engine'

/*
 * Requests that expect a "text/plain" Content-Type have been collected by scanning
 * the developer documentation:
 * https://docs.dhis2.org/master/en/developer/html/dhis2_developer_manual_full.html
 *
 * Note that currently it is not allowed to include an id property on a "create"
 * mutation object. This means that currently the `id` will always be included in
 * the resource property (string). If we decide to allow the `id` property for
 * "create" mutation-objects, we will have to include additional checks below.
 */

// POST to `messageConversations/${id}` (reply to a messagConversation)
export const isReplyToMessageConversation = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    const pattern = /^messageConversations\/[a-zA-Z0-9]{11}$/
    return type === 'create' && pattern.test(resource)
}

// POST to 'messageConversations/feedback' (create a feedback message)
export const isCreateFeedbackMessage = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => type === 'create' && resource === 'messageConversations/feedback'

// POST `interpretations/${objectType}/${id}` (add an interpretation to a visualization)
export const isCreateInterpretation = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    const pattern =
        /^interpretations\/(?:reportTable|chart|visualization|map|eventVisualization|eventReport|eventChart|dataSetReport)\/[a-zA-Z0-9]{11}$/
    return type === 'create' && pattern.test(resource)
}

// PUT to `interpretations/${id}` (update an interpretation)
export const isUpdateInterpretation = (
    type: FetchType,
    { resource, id }: ResolvedResourceQuery
): boolean => {
    if (type !== 'replace') {
        return false
    }

    let resourcePattern
    if (id) {
        resourcePattern = /^interpretations$/
        const idPattern = /^[a-zA-Z0-9]{11}$/

        return resourcePattern.test(resource) && idPattern.test(id)
    }

    resourcePattern = /^interpretations\/[a-zA-Z0-9]{11}$/

    return resourcePattern.test(resource)
}

// POST to `interpretations/${id}/comments` (comment on an interpretation)
export const isCommentOnInterpretation = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    const pattern = /^interpretations\/[a-zA-Z0-9]{11}\/comments$/
    return type === 'create' && pattern.test(resource)
}

// PUT to `interpretations/${interpretationId}/comments/${commentId}`
// (update an interpretation comment)
export const isInterpretationCommentUpdate = (
    type: FetchType,
    { resource, id }: ResolvedResourceQuery
): boolean => {
    if (type !== 'replace') {
        return false
    }

    if (id) {
        const idPatternLong = /^[a-zA-Z0-9]{11}\/comments\/[a-zA-Z0-9]{11}$/
        const idPatternShort = /^[a-zA-Z0-9]{11}$/
        const resourcePattern = /^interpretations\/[a-zA-Z0-9]{11}\/comments$/

        return (
            (resource === 'interpretations' && idPatternLong.test(id)) ||
            (resourcePattern.test(resource) && idPatternShort.test(id))
        )
    }

    const pattern =
        /^interpretations\/[a-zA-Z0-9]{11}\/comments\/[a-zA-Z0-9]{11}$/
    return pattern.test(resource)
}

// POST to `systemSettings/${settingKey}` or `userSettings/${settingKey}`
// (add or update a single system or user setting)
export const isAddOrUpdateSystemOrUserSetting = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    // At least 4 chars because the all start with 'key' (i.e. keyStyle)
    const pattern = /^(?:systemSettings|userSettings)\/[a-zA-Z]{4,}$/
    return type === 'create' && pattern.test(resource)
}

// POST to `configuration/${configurationProperty}`
// (add or update a single configuration property)
export const addOrUpdateConfigurationProperty = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    // NOTE: The corsWhitelist property does expect "application/json"
    const pattern = /^(configuration)\/([a-zA-Z]{1,50})$/
    const match = resource.match(pattern)
    return type === 'create' && !!match && match[2] !== 'corsWhitelist'
}

// POST to 'synchronization/metadataPull' (install a metadata package)
export const isMetadataPackageInstallation = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => type === 'create' && resource === 'synchronization/metadataPull'

// POST to 'indicators/expression/description' or 'programIndicator/expression/description' (validate an expression)
export const isExpressionDescriptionValidation = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    const pattern = /^(indicators|programIndicators)\/expression\/description$/
    return type === 'create' && pattern.test(resource)
}

// POST to 'programIndicator/filter/description' (validate a filter)
export const isFilterDescriptionValidation = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean => {
    const pattern = /^programIndicators\/filter\/description$/
    return type === 'create' && pattern.test(resource)
}
