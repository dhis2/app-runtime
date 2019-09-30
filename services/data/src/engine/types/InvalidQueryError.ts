export class InvalidQueryError extends Error {
    public type = 'invalid-query'
    public details: string[]
    public constructor(errors: string[]) {
        super(`Invalid query\n${errors.map(e => ' - ' + e).join('\n')}`)
        this.details = errors
    }
}
