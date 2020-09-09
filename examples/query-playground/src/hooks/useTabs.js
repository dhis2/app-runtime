import { useConfig } from '@dhis2/app-runtime'
import { useState } from 'react'

const tabTemplate = {
    active: false,
    query: null,
    type: 'query',
    result: '',
}

const setActiveTab = (tabs, index) =>
    tabs.map((tab, curIndex) => ({
        ...tab,
        active: curIndex === index,
    }))

const addTab = tabs => [
    ...tabs.map(tab => ({ ...tab, active: false })),
    { ...tabTemplate, active: true },
]

const setValue = ({ key, tabs, setTabs }) => index => value => {
    const update = { ...tabs[index], [key]: value }

    if (index === 0) {
        return setTabs([update, ...tabs.slice(1)])
    }

    return setTabs([...tabs.slice(0, index), update, ...tabs.slice(index + 2)])
}

export const useTabs = () => {
    const { baseUrl } = useConfig()
    const storageNameSpace = `${baseUrl}-playground`
    const [tabs, _setTabs] = useState(
        localStorage.getItem(storageNameSpace)
            ? JSON.parse(localStorage.getItem(storageNameSpace))
            : addTab([])
    )

    const setTabs = tabs => {
        // Don't store results
        const storageTabs = tabs.map(tab => ({ ...tab, result: '' }))
        localStorage.setItem(storageNameSpace, JSON.stringify(storageTabs))

        _setTabs(tabs)
    }

    const setQuery = setValue({ key: 'query', tabs, setTabs })
    const setResult = setValue({ key: 'result', tabs, setTabs })
    const setType = setValue({ key: 'type', tabs, setTabs })

    return {
        tabs,
        setQuery,
        setResult,
        setType,
        setActiveTab: index => setTabs(setActiveTab(tabs, index)),
        addTab: () => setTabs(addTab(tabs)),
    }
}
