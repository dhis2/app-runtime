import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import styles from './ServerDetails.module.css'

export const ServerDetails = () => {
    const { baseUrl, apiVersion } = useConfig()
    return (
        <div className={styles.server}>
            <span className={styles.serverLabel}>{i18n.t('Server')}</span>

            <a
                className={styles.serverLink}
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                {baseUrl}
            </a>

            <br />

            <span className={styles.apiVersionLabel}>
                {i18n.t('API version')}
            </span>

            {apiVersion}
        </div>
    )
}
