import { CssVariables } from '@dhis2/ui'
import React from 'react'

import { QueryTab } from './components/QueryTab'
import { TabControls } from './components/TabControls'
import { useTabs } from './hooks/useTabs'
import styles from './QueryRepl.module.css'

import './locales'

const QueryRepl = () => {
    const { tabs, setActiveTab, addTab } = useTabs()

    return (
        <div className={styles.container}>
            <CssVariables colors />

            <div className={styles.tabControls}>
                <TabControls
                    tabs={tabs}
                    onAddTab={addTab}
                    onTabClick={setActiveTab}
                />
            </div>

            <div className={styles.tabs}>
                {tabs.map((active, index) => (
                    <QueryTab tabNo={index} active={active} key={index} />
                ))}
            </div>
        </div>
    )
}

export default QueryRepl
