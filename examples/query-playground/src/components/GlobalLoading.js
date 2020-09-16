import { CircularLoader } from '@dhis2/ui'
import React from 'react'
import styles from './GlobalLoading.module.css'

export const GlobalLoading = () => (
    <div className={styles.container}>
        <CircularLoader />
    </div>
)
