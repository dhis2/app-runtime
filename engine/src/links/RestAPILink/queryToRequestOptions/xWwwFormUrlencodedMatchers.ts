import type { ResolvedResourceQuery, FetchType } from '../../../types'

// POST to convert an SVG file
export const isSvgConversion = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean =>
    type === 'create' && (resource === 'svg.png' || resource === 'svg.pdf')
