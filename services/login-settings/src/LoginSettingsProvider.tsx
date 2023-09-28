import { useDataQuery } from '@dhis2/app-service-data'
import React, { useState } from 'react'
import { LoginSettingsContext } from './LoginSettingsContext'
import { LoginSettings, Locale } from './types'

const querySettings = {
    loginSettings: {
        resource: 'auth/loginConfig',
        params: ({ locale }: any) =>
            locale
                ? {
                      paging: false,
                      locale,
                  }
                : {
                      paging: false,
                  },
    },
}

const queryLocales = {
    localesUI: {
        resource: 'locales/ui',
    },
}

const localStorageLocaleKey = 'dhis2.locale.ui'

const defaultLocales = [
    { locale: 'en', name: 'English', displayName: 'English' },
]

const transformFetchedLocales = (fetchedLocales: any): Locale[] => {
    if (Array.isArray(fetchedLocales)) {
        return fetchedLocales.map((locale) => ({
            name: locale?.name,
            locale: locale?.locale,
            displayName: locale?.displayName,
        }))
    }
    return defaultLocales
}

const getLocale = (
    selectedLocale: string | null,
    systemUiLocale: string | undefined
): string => {
    if (selectedLocale !== null) {
        return selectedLocale
    }
    if (systemUiLocale) {
        return systemUiLocale
    }
    return 'en'
}

const getDefaultSettings = (): LoginSettings => ({
    applicationDescription:
        'This is the long application subtitle where there is a lot of information included in the subtitle so it must handle this much information',
    applicationFooter: 'Application left side footer text',
    applicationNotification:
        'this is placeholder for the application notification.',
    allowAccountRecovery: true,
    applicationTitle: 'Example application title that could be very long',
    countryFlag: 'http://localhost:8080/dhis-web-commons/flags/norway.png',
    useCountryFlag: true,
    loginPageLogo: 'http://localhost:8080/api/staticContent/logo_front',
    useLoginPageLogo: true,
    emailConfigured: true,
    selfRegistrationEnabled: true,
    selfRegistrationNoRecaptcha: false,
    systemUiLocale: 'en',
    uiLocale: 'en',
    localesUI: defaultLocales,
    htmlTemplate: 'standard',
    refreshOnTranslation: ({ locale }) => {
        throw new Error('This function is not implemented')
    },
})

export const LoginSettingsProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const { data, called, error, refetch } = useDataQuery(querySettings, {
        variables: { locale: localStorage[localStorageLocaleKey] },
    })

    const {
        data: dataLocales,
        called: calledLocales,
        error: errorLocales,
    } = useDataQuery(queryLocales)

    const [selectedLocale, setSelectedLocale] = useState(
        window.localStorage.getItem(localStorageLocaleKey)
    )

    const refreshOnTranslation = ({ locale }: { locale: string }) => {
        refetch({ locale })
        setSelectedLocale(locale)
        localStorage.setItem(localStorageLocaleKey, locale)
    }

    const fetchedLoginSettings: any =
        typeof data?.loginSettings === 'object' ? data.loginSettings : {}

    const providerValue = {
        ...getDefaultSettings(),
        ...fetchedLoginSettings,
        uiLocale: getLocale(
            selectedLocale,
            fetchedLoginSettings?.systemUiLocale
        ),
        localesUI: transformFetchedLocales(dataLocales?.localesUI),
        refreshOnTranslation,
        error: error || errorLocales,
        called: called && calledLocales,
    }

    return (
        <LoginSettingsContext.Provider value={providerValue}>
            {children}
        </LoginSettingsContext.Provider>
    )
}
