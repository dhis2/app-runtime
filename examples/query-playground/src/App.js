import { CssVariables } from '@dhis2/ui'
import React from 'react'

import { QueryTab } from './components/QueryTab'
import { TabControls } from './components/TabControls'
import { useTabs } from './hooks/useTabs'
import styles from './QueryRepl.module.css'

import './locales'

const QueryRepl = () => {
    const { tabs, setActiveTab, addTab, setQuery, setResult } = useTabs()
    const activeTabIndex = tabs.findIndex(({ active }) => active)
    const activeTab = tabs[activeTabIndex]

    return (
        <div className={styles.container}>
            <CssVariables colors />

            <div className={styles.tabControls}>
                <TabControls
                    tabs={tabs.map(({ active }) => active)}
                    onAddTab={addTab}
                    onTabClick={setActiveTab}
                />
            </div>

            <div className={styles.tabs}>
                <QueryTab
                    query={activeTab.query}
                    result={activeTab.result}
                    active={activeTab.active}
                    setQuery={setQuery(activeTabIndex)}
                    setResult={setResult(activeTabIndex)}
                />
            </div>
        </div>
    )
}

export default QueryRepl
