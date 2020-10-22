import { ResolvedResourceQuery, FetchType } from '../../../engine'

/*
 * Requests that expect a "multipart/form-data" Content-Type have been collected by scanning
 * the developer documentation:
 * https://docs.dhis2.org/master/en/developer/html/dhis2_developer_manual_full.html
 */

// POST to 'fileResources' (upload a file resource)
export const fileResourceUpload = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) => type === 'create' && resource === 'fileResources'

// POST to `staticContent/${key}` (upload staticContent: logo_banner | logo_front)
export const isStaticContentUpload = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
) => {
    const pattern = /^staticContent\/(?:logo_banner|logo_front)$/
    return type === 'create' && pattern.test(resource)
}
