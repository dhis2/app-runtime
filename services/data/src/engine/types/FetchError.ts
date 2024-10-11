export type FetchErrorTypeName = 'network' | 'unknown' | 'access' | 'aborted'
export type FetchErrorDetails = {
    errorCode?: number
    httpStatus?: string
    httpStatusCode?: number
    message?: string
    status?: string
    [x: string]: any
}

export interface FetchErrorPayload {
    type: FetchErrorTypeName
    details?: FetchErrorDetails
    message: string
}

export class FetchError extends Error implements FetchErrorPayload {
    public type: FetchErrorTypeName
    public details: FetchErrorDetails

    public constructor({ message, type, details = {} }: FetchErrorPayload) {
        super(message)
        this.type = type
        this.details = details
    }
}
