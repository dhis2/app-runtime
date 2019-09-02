import { FetchError } from '../types/FetchError'
import { JsonValue } from '../types/JsonValue'

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
        .then(async response => {
            if (
                response.status === 401 ||
                response.status === 403 ||
                response.status === 409
            ) {
                throw new FetchError({
                    type: 'access',
                    message: await response
                        .json()
                        .then(body => body.message)
                        .catch(() =>
                            response.status === 401
                                ? 'Unauthorized'
                                : 'Forbidden'
                        ),
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
        })
        .then(async response => {
            return await response.json().catch(() => null)
        })
}
