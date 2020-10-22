import { ResolvedResourceQuery, FetchType } from '../../../engine'
import * as textPlainMatchers from './textPlainMatchers'
import * as multipartFormDataMatchers from './multipartFormDataMatchers'

type RequestContentType =
    | 'application/json'
    | 'text/plain'
    | 'multipart/form-data'
    | null

type FormData = {
    [key: string]: string | Blob
}

const resourceExpectsTextPlain = (
    type: FetchType,
    query: ResolvedResourceQuery
) =>
    Object.values(textPlainMatchers).some(textPlainMatcher =>
        textPlainMatcher(type, query)
    )

const resourceExpectsMultipartFormData = (
    type: FetchType,
    query: ResolvedResourceQuery
) =>
    Object.values(multipartFormDataMatchers).some(multipartFormDataMatcher =>
        multipartFormDataMatcher(type, query)
    )

export const requestContentType = (
    type: FetchType,
    query: ResolvedResourceQuery
) => {
    if (!query.data) {
        return null
    }

    if (resourceExpectsTextPlain(type, query)) {
        return 'text/plain'
    }

    if (resourceExpectsMultipartFormData(type, query)) {
        return 'multipart/form-data'
    }

    return 'application/json'
}

export const requestHeadersForContentType = (
    contentType: RequestContentType
) => {
    if (!contentType) {
        return undefined
    }

    return { 'Content-Type': contentType }
}

export const requestBodyForContentType = (
    contentType: RequestContentType,
    { data }: ResolvedResourceQuery
) => {
    if (typeof data === 'undefined') {
        return undefined
    }

    if (contentType === 'application/json') {
        return JSON.stringify(data)
    }

    if (contentType === 'multipart/form-data') {
        return Object.entries(data as FormData).reduce(
            (formData, [key, value]) => {
                formData.append(key, value)
                return formData
            },
            new FormData()
        )
    }

    // 'text/plain'
    return data
}
