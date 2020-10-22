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

export const FORM_DATA_ERROR_MSG =
    'Could not convert data to FormData: object does not have own enumerable string-keyed properties'

const convertToFormData = (data: FormData) => {
    const dataEntries = Object.entries(data)

    if (dataEntries.length === 0) {
        throw new Error(FORM_DATA_ERROR_MSG)
    }

    return dataEntries.reduce((formData, [key, value]) => {
        formData.append(key, value)
        return formData
    }, new FormData())
}

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
) => {
    if (typeof data === 'undefined') {
        return undefined
    }

    if (contentType === 'application/json') {
        return JSON.stringify(data)
    }

    if (contentType === 'multipart/form-data') {
        return convertToFormData(data)
    }

    // 'text/plain'
    return data
}
