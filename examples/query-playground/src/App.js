import { CssVariables } from '@dhis2/ui'
import React from 'react'

import { GlobalLoading } from './components/GlobalLoading'
import { QueryTab } from './components/QueryTab'
import { TabControls } from './components/TabControls'
import { useTabs } from './hooks/useTabs'
import { useExecuteQuery } from './hooks/useExecuteQuery'
import styles from './QueryRepl.module.css'

import './locales'

const QueryRepl = () => {
    const { loading, execute } = useExecuteQuery()
    const {
        addTab,
        removeTab,
        setActiveTab,
        setName,
        setQuery,
        setResult,
        setType,
        tabs,
    } = useTabs()
    const activeTabIndex = tabs.findIndex(({ active }) => active)
    const activeTab = tabs[activeTabIndex]

    return (
        <div className={styles.container}>
            <CssVariables colors />

            {loading && <GlobalLoading />}

            <div className={styles.tabControls}>
                <TabControls
                    tabs={tabs}
                    onAddTab={addTab}
                    onNameChange={setName}
                    onRemoveTab={removeTab}
                    onTabClick={setActiveTab}
                />
            </div>

            <div className={styles.tabs}>
                <QueryTab
                    type={activeTab.type}
                    query={activeTab.query}
                    result={activeTab.result}
                    active={activeTab.active}
                    setQuery={setQuery(activeTabIndex)}
                    setResult={setResult(activeTabIndex)}
                    setType={setType(activeTabIndex)}
                    execute={execute}
                />
            </div>
        </div>
    )
}

export default QueryRepl
