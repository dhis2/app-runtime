import { Version } from '@dhis2/app-service-config'
import { isPingAvailable } from './is-ping-available'

const fixedVersions: Version[] = [
    { full: 'unimportant', major: 2, minor: 40, patch: 0 },
    { full: 'unimportant', major: 2, minor: 39, patch: 2 },
    { full: 'unimportant', major: 2, minor: 38, patch: 3 },
    { full: 'unimportant', major: 2, minor: 37, patch: 10 },
    { full: 'unimportant', major: 2, minor: 40, tag: 'SNAPSHOT' },
    { full: 'unimportant', major: 2, minor: 3291, patch: 0 },
]

const unsupportedVersions: Version[] = [
    { full: 'unimportant', major: 2, minor: 39, patch: 1 },
    { full: 'unimportant', major: 2, minor: 38, patch: 2 },
    { full: 'unimportant', major: 2, minor: 37, patch: 9 },
    { full: 'unimportant', major: 2, minor: 36, patch: 12 },
    { full: 'unimportant', major: 2, minor: 35, patch: 0 },
    { full: 'unimportant', major: 2, minor: 0, patch: 0 },
]

test('supported server versions pass', () => {
    fixedVersions.forEach((version) => {
        expect(isPingAvailable(version)).toBe(true)
    })
})

test('unsupported server versions fail', () => {
    unsupportedVersions.forEach((version) => {
        expect(isPingAvailable(version)).toBe(false)
    })
})
