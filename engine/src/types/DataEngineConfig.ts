export interface DataEngineConfig {
    baseUrl: string
    apiVersion: number
    serverVersion?: {
        major: number
        minor: number
        patch?: number
        full: string
    }
    apiToken?: string
}
