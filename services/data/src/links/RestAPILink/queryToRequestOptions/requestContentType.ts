import { ResolvedResourceQuery, FetchType } from '../../../engine'
import * as multipartFormDataMatchers from './multipartFormDataMatchers'
import * as textPlainMatchers from './textPlainMatchers'
import * as xWwwFormUrlencodedMatchers from './xWwwFormUrlencodedMatchers'

type RequestContentType =
    | 'application/json'
    | 'application/json-patch+json'
    | 'text/plain'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
    | null

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

const resourceExpectsXWwwFormUrlencoded = (
    type: FetchType,
    query: ResolvedResourceQuery
) =>
    Object.values(xWwwFormUrlencodedMatchers).some(xWwwFormUrlencodedMatcher =>
        xWwwFormUrlencodedMatcher(type, query)
    )

const convertData = (
    data: Record<string, any>,
    initialValue: FormData | URLSearchParams
): FormData | URLSearchParams => {
    const dataEntries = Object.entries(data)

    if (dataEntries.length === 0) {
        throw new Error(
            `Could not convert data to ${initialValue.constructor.name}: object does not have own enumerable string-keyed properties`
        )
    }

    return dataEntries.reduce((convertedData, [key, value]) => {
        convertedData.append(key, value)
        return convertedData
    }, initialValue)
}

export const requestContentType = (
    type: FetchType,
    query: ResolvedResourceQuery
): null | RequestContentType => {
    if (!query.data) {
        return null
    }

    if (type === 'json-patch') {
        return 'application/json-patch+json'
    }

    if (resourceExpectsTextPlain(type, query)) {
        return 'text/plain'
    }

    if (resourceExpectsMultipartFormData(type, query)) {
        return 'multipart/form-data'
    }

    if (resourceExpectsXWwwFormUrlencoded(type, query)) {
        return 'application/x-www-form-urlencoded'
    }

    return 'application/json'
}

export const requestHeadersForContentType = (
    contentType: RequestContentType
): undefined | Record<'Content-Type', string> => {
    /*
     * Explicitely setting Content-Type to 'multipart/form-data' produces
     * a "multipart boundary not found" error. By not setting a Content-Type
     * the browser will correctly set it for us and also apply multipart
     * boundaries if the request body is an instance of FormData
     * See https://stackoverflow.com/a/39281156/1143502
     */
    if (!contentType || contentType === 'multipart/form-data') {
        return undefined
    }

    return { 'Content-Type': contentType }
}

export const requestBodyForContentType = (
    contentType: RequestContentType,
    { data }: ResolvedResourceQuery
): undefined | string | FormData | URLSearchParams => {
    if (typeof data === 'undefined') {
        return undefined
    }

    if (
        contentType === 'application/json' ||
        contentType === 'application/json-patch+json'
    ) {
        return JSON.stringify(data)
    }

    if (contentType === 'multipart/form-data') {
        return convertData(data, new FormData())
    }

    if (contentType === 'application/x-www-form-urlencoded') {
        return convertData(data, new URLSearchParams())
    }

    // 'text/plain'
    return data
}
