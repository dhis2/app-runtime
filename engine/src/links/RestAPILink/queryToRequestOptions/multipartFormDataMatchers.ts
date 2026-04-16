import type { ResolvedResourceQuery, FetchType } from '../../../types'

/*
 * Requests that expect a "multipart/form-data" Content-Type have been collected by scanning
 * the developer documentation:
 * https://docs.dhis2.org/master/en/developer/html/dhis2_developer_manual_full.html
 */

// Post to 'dataValues' (send/update a data value; endpoint doesn't support JSON)
// For file-uploads too
export const isDataValue = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) =>
    type === 'create' &&
    (resource === 'dataValues' || resource === 'dataValues/file')

// POST to 'fileResources' (upload a file resource)
export const isFileResourceUpload = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) => type === 'create' && resource === 'fileResources'

// POST to 'messageConversations/attachments' (upload a message conversation attachment)
export const isMessageConversationAttachment = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) => type === 'create' && resource === 'messageConversations/attachments'

// POST to `staticContent/${key}` (upload staticContent: logo_banner | logo_front)
export const isStaticContentUpload = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) => {
    const pattern = /^staticContent\/(?:logo_banner|logo_front)$/
    return type === 'create' && pattern.test(resource)
}

// POST to 'apps' (install an app)
export const isAppInstall = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) => type === 'create' && resource === 'apps'
