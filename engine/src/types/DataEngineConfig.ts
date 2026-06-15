export interface DataEngineConfig {
    baseUrl: string
    serverVersion?: {
        major: number
        minor: number
        patch?: number
        full: string
    }
    apiToken?: string
}
