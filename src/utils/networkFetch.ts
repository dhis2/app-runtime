import { FetchError } from '../types/FetchError'

export function fetchData(
    url: string,
    options: RequestInit = {}
): Promise<Object> {
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers,
        },
    })
        .catch(err => {
            throw new FetchError(
                'network',
                'An unknown network error occurred',
                err
            )
        })
        .then(response => {
            if (
                response.status === 401 ||
                response.status === 403 ||
                response.status === 409
            ) {
                throw new FetchError('access', response.statusText, response)
            }
            if (response.status < 200 || response.status >= 400) {
                throw new FetchError(
                    'unknown',
                    `An unknown error occurred - ${response.statusText} (${
                        response.status
                    })`,
                    response
                )
            }
            return response
        })
        .then(response => response.json())
}
