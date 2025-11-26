import { FetchError, QueryRefetchFunction } from '@dhis2/app-service-data'

export interface CurrentUser {
    id: string
    username: string
    displayName: string
    authorities: string[]
    organisationUnits: Array<{ id: string; }>

    name?: string
    surname?: string
    firstName?: string
    email?: string
    emailVerified?: boolean
    introduction?: string
    birthday?: string
    nationality?: string
    education?: string
    interests?: string
    whatsApp?: string
    facebookMessenger?: string
    skype?: string
    telegram?: string
    twitter?: string
    employer?: string
    languages?: string
    gender?: string
    jobTitle?: string

    created?: string
    lastUpdated?: string

    access?: {
        manage: boolean
        externalize?: boolean
        write: boolean
        read: boolean
        update: boolean
        delete: boolean
        [key: string]: any
    }

    settings?: {
        keyDbLocale?: string
        keyMessageSmsNotification?: boolean
        keyTrackerDashboardLayout?: string
        keyStyle?: string
        keyUiLocale?: string
        keyAnalysisDisplayProperty?: string
        keyMessageEmailNotification?: boolean
        [key: string]: any
    }

    userGroups?: Array<{ id: string; }>
    userRoles?: Array<{ id: string; }>
    dataViewOrganisationUnits?: Array<{ id: string }>
    teiSearchOrganisationUnits?: Array<{ id: string }>
    programs?: Array<string>
    dataSets?: Array<string>
    patTokens?: Array<{ id: string }>
    attributeValues?: Array<any>
    favorites?: Array<any>
    translations?: Array<any>

    twoFactorType?: string
}


export interface CurrentUserState {
    user: CurrentUser | undefined
    loading: boolean
    error: FetchError | undefined
    refetch: QueryRefetchFunction | (() => void)
}