import { FetchError } from '../../errors/FetchError'
import type { FetchErrorDetails } from '../../errors/FetchError'
import type { JsonValue } from '../../types/JsonValue'
import { QueryAlias } from '../../types/QueryAlias'
import { RestAPILink } from '../RestAPILink'

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
    link: RestAPILink,
    options: RequestInit
) => {
    const alias = <QueryAlias>await link.executeResourceQuery(
        'create',
        {
            resource: 'query/alias',
            data: {
                target: url,
            },
        },
        { signal: options.signal }
    )

    link.queryAliasCache.set(url, alias)

    return fetchWithContext(alias.href, options, link)
}

const fetchWithContext = (
    url: string,
    options: RequestInit,
    link: RestAPILink
) =>
    fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
            Authorization: link.config.apiToken
                ? `ApiToken ${link.config.apiToken}`
                : '',
            ...options.headers,
        },
    })

const fetchDirectOrCreateAlias = async (
    url: string,
    options: RequestInit,
    link: RestAPILink
) => {
    const response = await fetchWithContext(url, options, link)

    if (isRequestUriTooLongError(response)) {
        return createQueryAlias(url, link, options)
    }

    return response
}

const fetchAlias = async (
    alias: QueryAlias,
    options: RequestInit,
    link: RestAPILink
) => {
    const response = await fetchWithContext(alias.href, options, link)

    if (
        response.status === 404 &&
        response.statusText === ALIAS_NOT_FOUND_MESSAGE
    ) {
        // If the query itself no longer exists it may have expired or been evicted by the server.
        // Create a new query alias and cache it
        // TODO: detecting based on statusText is brittle, we should look into including an error code in the response
        return createQueryAlias(alias.target, link, options)
    }

    return fetchWithContext(alias.href, options, link)
}

export function fetchData(
    url: string,
    options: RequestInit = {},
    link: RestAPILink
): Promise<JsonValue> {
    const alias = link.queryAliasCache.get(url)

    const hasCachedAlias = alias !== undefined

    const fetchPromise: Promise<Response> = hasCachedAlias
        ? fetchAlias(alias, options, link)
        : fetchDirectOrCreateAlias(url, options, link)

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
