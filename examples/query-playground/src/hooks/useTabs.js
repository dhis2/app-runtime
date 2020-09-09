import { useState } from 'react'

const tabTemplate = {
    active: false,
    query: null,
    result: '',
}

const setActiveTab = (tabs, index) =>
    tabs.map((tab, curIndex) => ({
        ...tab,
        active: curIndex === index,
    }))

const addTab = tabs => [...tabs, { ...tabTemplate, active: true }]

export const useTabs = () => {
    const [tabs, setTabs] = useState(addTab([]))

    const setQuery = index => query =>
        setTabs([
            ...tabs.slice(0, index),
            { ...tabs[index], query },
            ...tabs.slice(index + 2),
        ])

    const setResult = index => result =>
        setTabs([
            ...tabs.slice(0, index),
            { ...tabs[index], result },
            ...tabs.slice(index + 2),
        ])

    return {
        tabs,
        setQuery,
        setResult,
        setActiveTab: index => setTabs(setActiveTab(tabs, index)),
        addTab: () => setTabs(addTab(tabs)),
    }
}
