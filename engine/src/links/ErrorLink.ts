import type { DataEngineLink } from '../types/DataEngineLink'

export class ErrorLink implements DataEngineLink {
    private readonly errorMessage: string
    public constructor(errorMessage: string) {
        this.errorMessage = errorMessage
    }
    public executeResourceQuery() {
        console.error(this.errorMessage)
        return Promise.reject(new Error(this.errorMessage))
    }
}
