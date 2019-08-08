import { FetchError } from '../types/FetchError'

export function fetchData(
    url: string,
    options: RequestInit = {}
): Promise<object> {
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
        .then(response => {
            if (
                response.status === 401 ||
                response.status === 403 ||
                response.status === 409
            ) {
                throw new FetchError({
                    type: 'access',
                    message: response.statusText,
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
        .then(response => response.json())
}
