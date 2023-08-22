import { ResolvedResourceQuery, FetchType } from '../../../engine'

// POST to convert an SVG file
export const isSvgConversion = (
    type: FetchType,
    { resource }: ResolvedResourceQuery
): boolean =>
    type === 'create' && (resource === 'svg.png' || resource === 'svg.pdf')
