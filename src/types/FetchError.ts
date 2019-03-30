export type FetchErrorTypeName = 'network' | 'unknown' | 'access'
export type FetchErrorDetails = Response | Error

export type FetchErrorPayload = {
    type: FetchErrorTypeName
    message: string
    details?: FetchErrorDetails
}

export class FetchError extends Error implements FetchErrorPayload {
    type: FetchErrorTypeName
    details?: FetchErrorDetails

    constructor({ message, type, details }: FetchErrorPayload) {
        super(message)
        this.type = type
        this.details = details
    }
}
