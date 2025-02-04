import cx from 'classnames'
import React from 'react'
import { GlobalLoading } from './components/GlobalLoading.jsx'
import { QueryTab } from './components/QueryTab.jsx'
import { ServerDetails } from './components/ServerDetails.jsx'
import { TabControls } from './components/TabControls.jsx'
import { useExecuteQuery } from './hooks/useExecuteQuery'
import { useTabs } from './hooks/useTabs'
import styles from './QueryRepl.module.css'
import './locales/index.js'

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
