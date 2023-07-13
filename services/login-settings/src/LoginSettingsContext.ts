import React from 'react'
import { LoginSettings } from './types'

export const LoginSettingsContext = React.createContext<LoginSettings>({
    applicationDescription: '',
    applicationFooter: '',
    applicationNotification: '',
    allowAccountRecovery: false,
    applicationTitle: '',
    countryFlag: '',
    useCountryFlag: false,
    loginPageLogo: '',
    useLoginPageLogo: false,
    emailConfigured: false,
    selfRegistrationEnabled: false,
    selfRegistrationNoRecaptcha: false,
    systemUiLocale: '',
    uiLocale: '',
    localesUI: [],
    htmlTemplate: '',
    refreshOnTranslation: ({ locale }) => {
        throw new Error('This function is not implemented')
    },
    error: null,
    called: false,
})
