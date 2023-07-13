export interface Locale {
    locale: string
    name: string
    displayName?: string
}

export interface LoginSettings {
    applicationDescription?: string
    applicationFooter?: string
    applicationNotification?: string
    allowAccountRecovery?: boolean
    applicationTitle?: string
    countryFlag?: string
    useCountryFlag?: boolean
    loginPageLogo?: string
    useLoginPageLogo?: boolean
    emailConfigured?: boolean
    selfRegistrationEnabled?: boolean
    selfRegistrationNoRecaptcha?: boolean
    systemUiLocale?: string
    uiLocale?: string
    localesUI?: Locale[]
    htmlTemplate?: string
    refreshOnTranslation?: ({ locale }: { locale: string }) => void
    error?: Error | null
    called?: boolean
}
