export type FetchErrorTypeName = 'network' | 'unknown' | 'access'
export type FetchErrorDetails = Response | Error

export interface FetchErrorPayload {
    type: FetchErrorTypeName
    message: string
    details?: FetchErrorDetails
}

export class FetchError extends Error implements FetchErrorPayload {
    public type: FetchErrorTypeName
    public details?: FetchErrorDetails

    public constructor({ message, type, details }: FetchErrorPayload) {
        super(message)
        this.type = type
        this.details = details
    }
}
