import { Version } from '@dhis2/app-service-config'

/**
 * Checks the server version to see if the /api/ping endpoint is available for
 * this version.
 *
 * The endpoint was released for versions 2.37.10, 2.38.3, 2.39.2, and 2.40.0
 * (see DHIS2-14531). All versions below that are considered unsupported
 *
 * If the patchVersion is undefined, it's assumed to be a dev server that's
 * newer than the fix versions listed above
 *
 * Major versions above 2 aren't supported 🤷‍♂️
 */
export function isPingAvailable(serverVersion: Version) {
    if (!serverVersion) {
        return false
    }

    const { minor, patch } = serverVersion
    switch (minor) {
        case 39:
            return patch === undefined || patch >= 2
        case 38:
            return patch === undefined || patch >= 3
        case 37:
            return patch === undefined || patch >= 10
        default:
            return minor >= 40
    }
}
