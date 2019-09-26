import { DataEngineLink } from '../engine'

export class ErrorLink implements DataEngineLink {
    private errorMessage: string
    public constructor(errorMessage: string) {
        this.errorMessage = errorMessage
    }
    public executeResourceQuery() {
        console.error(this.errorMessage)
        return Promise.reject(this.errorMessage)
    }
}
