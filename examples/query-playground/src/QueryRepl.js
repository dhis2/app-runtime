import React from 'react'
import cx from 'classnames'

import { GlobalLoading } from './components/GlobalLoading'
import { QueryTab } from './components/QueryTab'
import { TabControls } from './components/TabControls'
import { useTabs } from './hooks/useTabs'
import { useExecuteQuery } from './hooks/useExecuteQuery'
import styles from './QueryRepl.module.css'

import './locales'
import { ServerDetails } from './components/ServerDetails'

export const QueryRepl = () => {
    const { loading, execute } = useExecuteQuery()
    const {
        addTab,
        removeTab,
        setActiveTab,
        setName,
        setQuery,
        setResult,
        setType,
        activeTab,
        tabs,
    } = useTabs()

    const currentTab = tabs[activeTab]

    return (
        <div className={styles.container}>
            {loading && <GlobalLoading />}

            <div
                className={cx(styles.contentWrapper, {
                    [styles.loading]: loading,
                })}
            >
                <div className={styles.topBar}>
                    <TabControls
                        activeTab={activeTab}
                        tabs={tabs}
                        onAddTab={addTab}
                        onNameChange={setName}
                        onRemoveTab={removeTab}
                        onTabClick={setActiveTab}
                    />
                    <ServerDetails />
                </div>

                <div className={styles.content}>
                    <QueryTab
                        type={currentTab.type}
                        query={currentTab.query}
                        result={currentTab.result}
                        active={currentTab.active}
                        setQuery={setQuery}
                        setResult={setResult}
                        setType={setType}
                        execute={execute}
                    />
                </div>
            </div>
        </div>
    )
}
