import { FetchError, JsonValue } from '../../engine'

export const parseContentType = (contentType: string | null) => {
    return contentType
        ? contentType
              .split(';')[0]
              .trim()
              .toLowerCase()
        : null
}

export const parseStatus = async (response: Response) => {
    if (
        response.status === 401 ||
        response.status === 403 ||
        response.status === 409
    ) {
        const message = await response
            .json()
            .then(body => {
                return body.message
            })
            .catch(() => {
                return response.status === 401 ? 'Unauthorized' : 'Forbidden'
            })

        throw new FetchError({
            type: 'access',
            message,
            details: response,
        })
    }
    if (response.status < 200 || response.status >= 400) {
        throw new FetchError({
            type: 'unknown',
            message: `An unknown error occurred - ${response.statusText} (${response.status})`,
            details: response,
        })
    }
    return response
}

export function fetchData(
    url: string,
    options: RequestInit = {}
): Promise<JsonValue> {
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
            ...options.headers,
        },
    })
        .catch(err => {
            throw new FetchError({
                type: 'network',
                message: 'An unknown network error occurred',
                details: err,
            })
        })
        .then(parseStatus)
        .then(async response => {
            if (
                parseContentType(response.headers.get('Content-Type')) ===
                'application/json'
            ) {
                return await response.json() // Will throw if invalid JSON!
            }
            return await response.text()
        })
}
