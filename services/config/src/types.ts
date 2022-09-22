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
}

export interface Config {
    appName: string,
    appVersion: Version,
    baseUrl: string
    apiVersion: number
    serverVersion?: Version
    systemInfo?: SystemInfo
}
