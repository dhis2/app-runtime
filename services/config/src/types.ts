type Version = {
    full: string
    major: number
    minor: number
    patch?: number
    tag?: string
}

interface SystemInfo {
    version: string
    contextPath: string
    dateFormat: string
    serverTimeZoneId: string
}

export interface Config {
    baseUrl: string
    apiVersion: number
    appName?: string
    appVersion?: Version
    serverVersion?: Version
    systemInfo?: SystemInfo
}
