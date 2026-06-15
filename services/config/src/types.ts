export type Version = {
    full: string
    major: number
    minor: number
    patch?: number
    tag?: string
}

export type DateInput = string | Date | number | null | undefined

interface SystemInfo {
    version: string
    contextPath: string
    serverTimeZoneId: string
}

export interface Config {
    baseUrl: string
    appName?: string
    appVersion?: Version
    serverVersion?: Version
    systemInfo?: SystemInfo
}
