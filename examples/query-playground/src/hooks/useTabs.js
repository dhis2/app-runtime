import { useConfig } from '@dhis2/app-runtime'
import { useEffect, useMemo, useState } from 'react'

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
    name: 'Query',
    result: '',
}

const setActiveTab = (tabs, index) =>
    tabs.map((tab, curIndex) => ({
        ...tab,
        active: curIndex === index,
    }))

const addTab = (tabs, lastId, incLastId) => {
    const withNewTab = [
        ...tabs.map(tab => ({ ...tab, active: false })),
        { ...tabTemplate, active: true, id: lastId + 1 },
    ]

    incLastId()

    return withNewTab
}

const setNextTabToActive = (index, tabs) => {
    // if new active tab exists
    if (tabs[index]) {
        if (index === 0) {
            return [{ ...tabs[0], active: true }, ...tabs.slice(1)]
        }

        return [
            ...tabs.slice(0, index),
            { ...tabs[index], active: true },
            ...tabs.slice(index + 2),
        ]
    }

    return [...tabs.slice(0, -1), { ...tabs[tabs.length - 1], active: true }]
}

const removeTab = (index, tabs) => {
    const tabIsActive = tabs[index].active

    const afterRemoval =
        index === 0
            ? tabs.slice(1)
            : [...tabs.slice(0, index), ...tabs.slice(index + 1)]

    const withActive = !tabIsActive
        ? afterRemoval
        : // index = next tab
          setNextTabToActive(index, afterRemoval)

    return withActive
}

const setValue = ({ key, tabs, setTabs }) => index => value => {
    const update = { ...tabs[index], [key]: value }

    if (index === 0) {
        return setTabs([update, ...tabs.slice(1)])
    }

    return setTabs([...tabs.slice(0, index), update, ...tabs.slice(index + 1)])
}

const useLastId = storageNameSpace => {
    const storageLastId = `${storageNameSpace}.lastId`
    const lastStoredId = localStorage.getItem(storageLastId) || 0
    const [lastId, setLastId] = useState(parseInt(lastStoredId, 10))

    const incLastId = () => {
        const newLastId = lastId + 1
        localStorage.setItem(storageLastId, newLastId)
        setLastId(newLastId)
    }

    return { lastId, incLastId }
}

const useShouldReset = (storageNameSpace, lastId) => {
    const storageVersionName = `${storageNameSpace}.version`
    const lastVersion = localStorage.getItem(storageVersionName)

    useEffect(() => {
        localStorage.setItem(storageVersionName, VERSION)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return !lastVersion || lastVersion !== VERSION || !lastId
}

const storeTabs = (storageNameSpace, tabs) => {
    // Don't store results
    const storageTabs = tabs.map(tab => ({ ...tab, result: '' }))
    localStorage.setItem(storageNameSpace, JSON.stringify(storageTabs))
}

const useTabState = ({ shouldReset, storageNameSpace, lastId, incLastId }) => {
    // use useMemo so `addTag` does not fire on every render
    const initialState = useMemo(() => {
        return !shouldReset && localStorage.getItem(storageNameSpace)
            ? JSON.parse(localStorage.getItem(storageNameSpace))
            : addTab([], lastId, incLastId)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return useState(initialState)
}

export const useTabs = () => {
    const { baseUrl } = useConfig()
    const storageNameSpace = `${baseUrl}-playground`
    const { lastId, incLastId } = useLastId(storageNameSpace)
    const shouldReset = useShouldReset(storageNameSpace, lastId)
    const [tabs, _setTabs] = useTabState({
        incLastId,
        lastId,
        shouldReset,
        storageNameSpace,
    })

    const setTabs = tabs => {
        storeTabs(storageNameSpace, tabs)
        _setTabs(tabs)
    }

    useEffect(() => {
        storeTabs(storageNameSpace, tabs)
    }, [shouldReset]) // eslint-disable-line react-hooks/exhaustive-deps

    const setName = setValue({ key: 'name', tabs, setTabs })
    const setQuery = setValue({ key: 'query', tabs, setTabs })
    const setResult = setValue({ key: 'result', tabs, setTabs })
    const setType = setValue({ key: 'type', tabs, setTabs })

    return {
        tabs,
        setQuery,
        setResult,
        setType,
        setName,
        setActiveTab: index => setTabs(setActiveTab(tabs, index)),
        addTab: () => setTabs(addTab(tabs, lastId, incLastId)),
        removeTab: index => setTabs(removeTab(index, tabs)),
    }
}
