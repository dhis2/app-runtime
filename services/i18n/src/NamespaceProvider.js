import React from 'react'
import { NamespaceContext } from './NamespaceContext'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'

export const NamespaceProvider = ({ namespace, children }) => {
    return (
        <I18nextProvider i18n={i18next} defaultNS={namespace}>
            {children}
        </I18nextProvider>
    )
}
