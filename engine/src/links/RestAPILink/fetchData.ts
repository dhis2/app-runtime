import { FetchError } from '../../errors/FetchError'
import type { FetchErrorDetails } from '../../errors/FetchError'
import { DataEngineConfig } from '../../types'
import type { JsonValue } from '../../types/JsonValue'
import { QueryAlias, QueryAliasCache } from '../../types/QueryAlias'
import { joinPath } from './path'

export type FetchDataRefs = {
    queryAliasCache: QueryAliasCache
    config: DataEngineConfig
}

const ALIAS_NOT_FOUND_MESSAGE =
    'No query alias found with this hash id, it may have expired.'

export const parseContentType = (contentType: string | null) =>
    contentType ? contentType.split(';')[0].trim().toLowerCase() : ''

export const parseStatus = async (response: Response) => {
    const accessError =
        response.status === 401 ||
        response.status === 403 ||
        response.status === 409

    if (accessError) {
        let message
        let details: FetchErrorDetails = {}

        try {
            details = await response.json()
            message = details.message
        } catch (e) {
            // Do nothing
        }

        // Set a message in case of invalid json, or json without 'message' property
        if (!message) {
            message = response.status === 401 ? 'Unauthorized' : 'Forbidden'
        }

        throw new FetchError({
            type: 'access',
            message,
            details,
        })
    }

    if (response.status < 200 || response.status >= 400) {
        const message = `An unknown error occurred - ${response.statusText} (${response.status})`
        let details: FetchErrorDetails = {}

        try {
            details = await response.json()
        } catch (e) {
            // We can leave details as is if parsing fails
        }

        throw new FetchError({
            type: 'unknown',
            message,
            details,
        })
    }

    return response
}

const isRequestUriTooLongError = (response: Response) => {
    // TODO: in some situations could this cause a network error instead of a 414 HTTP response?
    if (response.status === 414) {
        // A network hop rejected this request because the URI is too long,
        // when possible we will retry using the Query Alias URI shortener

        return true
    }
    return false
}

const createQueryAlias = async (
    url: string,
    requestOptions: RequestInit,
    refs: FetchDataRefs
) => {
    // DHIS2 requires the target to be a root-relative path (/api/...).
    // Strip the baseUrl prefix if present so absolute URLs don't cause a 400.
    const target = url.startsWith(refs.config.baseUrl)
        ? url.slice(refs.config.baseUrl.length)
        : url

    const alias = <QueryAlias>await fetchData(
        joinPath(
            refs.config.baseUrl,
            'api',
            String(refs.config.apiVersion),
            'query/alias'
        ),
        {
            method: 'POST',
            signal: requestOptions.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target }),
        },
        refs
    )

    // DHIS2 constructs the href using its own internal origin, which may differ
    // from the baseUrl the client is using (e.g. when behind a reverse proxy on
    // a different port). Normalize it so the subsequent fetch reaches the right host.
    const normalizedAlias = {
        ...alias,
        href: alias.href.replace(/^https?:\/\/[^/]+/, refs.config.baseUrl),
    }
    refs.queryAliasCache.set(url, normalizedAlias)

    return fetchWithContext(normalizedAlias.href, requestOptions, refs)
}

const fetchWithContext = (
    url: string,
    requestOptions: RequestInit,
    refs: FetchDataRefs
) => {
    const requestInit: RequestInit = {
        ...requestOptions,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
            Authorization: refs.config.apiToken
                ? `ApiToken ${refs.config.apiToken}`
                : '',
            ...requestOptions.headers,
        },
    }
    return fetch(url, requestInit)
}

const fetchDirectOrCreateAlias = async (
    url: string,
    requestOptions: RequestInit,
    refs: FetchDataRefs
) => {
    const response = await fetchWithContext(url, requestOptions, refs)

    if (isRequestUriTooLongError(response)) {
        return createQueryAlias(url, requestOptions, refs)
    }

    return response
}

const fetchAlias = async (
    alias: QueryAlias,
    options: RequestInit,
    refs: FetchDataRefs
) => {
    const response = await fetchWithContext(alias.href, options, refs)

    if (
        response.status === 404 &&
        response.statusText === ALIAS_NOT_FOUND_MESSAGE
    ) {
        // If the query itself no longer exists it may have expired or been evicted by the server.
        // Create a new query alias and cache it
        // TODO: detecting based on statusText is brittle, we should look into including an error code in the response
        return createQueryAlias(alias.target, options, refs)
    }

    return response
}

export function fetchData(
    url: string,
    requestOptions: RequestInit,
    refs: FetchDataRefs
): Promise<JsonValue> {
    const alias = refs.queryAliasCache.get(url)

    const hasCachedAlias = alias !== undefined

    const fetchPromise: Promise<Response> = hasCachedAlias
        ? fetchAlias(alias, requestOptions, refs)
        : fetchDirectOrCreateAlias(url, requestOptions, refs)

    return fetchPromise

        .catch((err) => {
            throw new FetchError({
                type: 'network',
                message: 'An unknown network error occurred',
                details: err,
            })
        })
        .then(parseStatus)
        .then(async (response) => {
            const contentType = parseContentType(
                response.headers.get('Content-Type')
            )

            // 'application/json'
            if (contentType === 'application/json') {
                return await response.json() // Will throw if invalid JSON!
            }

            // 'text/*'
            if (/^text\/[a-z0-9.-]+$/.test(contentType)) {
                return await response.text()
            }

            return await response.blob()
        })
}
