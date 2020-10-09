type ServerVersion = {
    major: number
    minor: number
    patch?: number
    tag: string
}

interface SystemInfo {
    version: string
    contextPath: string
}

export interface Config {
    baseUrl: string
    apiVersion: number
    serverVersion?: ServerVersion
    systemInfo?: SystemInfo
}
