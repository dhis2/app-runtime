import { useConfig } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'

/*
 * If the shape of "tabTemplate" changes, by increasing the version number,
 * it'll prevent an error when parsing the existing cached data
 *
 * Is a string as localStorage only stores strings
 */
const VERSION = '1'

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

const useShouldReset = storageNameSpace => {
    const storageVersionName = `${storageNameSpace}.version`
    const lastVersion = localStorage.getItem(storageVersionName)

    useEffect(() => {
        localStorage.setItem(storageVersionName, VERSION)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return !lastVersion || lastVersion !== VERSION
}

const storeTabs = (storageNameSpace, tabs) => {
    // Don't store results
    const storageTabs = tabs.map(tab => ({ ...tab, result: '' }))
    localStorage.setItem(storageNameSpace, JSON.stringify(storageTabs))
}

export const useTabs = () => {
    const { baseUrl } = useConfig()
    const storageNameSpace = `${baseUrl}-playground`
    const shouldReset = useShouldReset(storageNameSpace)
    const [tabs, _setTabs] = useState(
        !shouldReset && localStorage.getItem(storageNameSpace)
            ? JSON.parse(localStorage.getItem(storageNameSpace))
            : addTab([])
    )

    const setTabs = tabs => {
        storeTabs(storageNameSpace, tabs)
        _setTabs(tabs)
    }

    useEffect(() => {
        storeTabs(storageNameSpace, tabs)
    }, [shouldReset]) // eslint-disable-line react-hooks/exhaustive-deps

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
