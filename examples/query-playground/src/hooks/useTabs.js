import { useConfig } from '@dhis2/app-runtime'
import { useEffect, useReducer } from 'react'

/*
 * If the shape of "tabTemplate" changes, by increasing the version number,
 * it'll prevent an error when parsing the existing cached data
 *
 * Is a string as localStorage only stores strings
 */
const VERSION = '2'

const tabTemplate = {
    query: null,
    type: 'query',
    name: 'Query',
    result: '',
}

const spliceTabs = (tabs, index, updatedTab) => {
    const before = index === 0 ? [] : tabs.slice(0, index)
    const after = tabs.slice(index + 1)
    const updated = updatedTab ? [updatedTab] : []
    return [...before, ...updated, ...after]
}

const newTab = id => {
    return { ...tabTemplate, id, name: `Query ${id}` }
}

const initTabState = storageNameSpace => {
    if (localStorage.getItem(storageNameSpace)) {
        const { version, ...storedState } = JSON.parse(
            localStorage.getItem(storageNameSpace)
        )
        if (version === VERSION && storedState.tabs?.length) {
            return storedState
        }
    }

    return {
        activeTab: 0,
        tabs: [newTab(1)],
    }
}
const nextAvailableId = tabs => {
    let candidate = 0
    while (tabs.some(tab => tab.id === candidate)) {
        ++candidate
    }
    return candidate
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'add': {
            return {
                ...state,
                activeTab: state.tabs.length,
                tabs: [...state.tabs, newTab(nextAvailableId(state.tabs))],
            }
        }
        case 'remove': {
            const index = action.payload.index
            return {
                ...state,
                activeTab: Math.min(
                    index < state.activeTab
                        ? state.activeTab - 1
                        : state.activeTab,
                    state.tabs.length - 2
                ),
                tabs: spliceTabs(state.tabs, index),
            }
        }
        case 'edit': {
            const index = action.payload.index
            const prevTab = state.tabs[index]
            if (!prevTab) {
                return state
            }
            return {
                ...state,
                tabs: spliceTabs(state.tabs, index, {
                    ...prevTab,
                    ...action.payload.updatedTab,
                }),
            }
        }
        case 'setActive': {
            return {
                ...state,
                activeTab: Math.max(
                    0,
                    Math.min(state.tabs.length - 1, action.payload.index)
                ),
            }
        }
    }
}

const prepareForStorage = state => ({
    version: VERSION,
    ...state,
    tabs: state.tabs.map(tab => ({ ...tab, result: '' })),
})

const useTabState = storageNameSpace => {
    const [state, dispatch] = useReducer(
        reducer,
        storageNameSpace,
        initTabState
    )

    useEffect(() => {
        localStorage.setItem(
            storageNameSpace,
            JSON.stringify(prepareForStorage(state))
        )
    }, [storageNameSpace, state])

    const addTab = () => {
        dispatch({
            type: 'add',
        })
    }

    const removeTab = index => {
        dispatch({
            type: 'remove',
            payload: {
                index,
            },
        })
    }

    const editTab = (index, updatedTab) => {
        dispatch({
            type: 'edit',
            payload: {
                index,
                updatedTab,
            },
        })
    }

    const setActiveTab = index => {
        dispatch({
            type: 'setActive',
            payload: {
                index,
            },
        })
    }

    return [
        state,
        {
            addTab,
            removeTab,
            editTab,
            setActiveTab,
        },
    ]
}

export const useTabs = () => {
    const { baseUrl } = useConfig()
    const storageNameSpace = `playground-${baseUrl}`
    const [state, { addTab, removeTab, editTab, setActiveTab }] = useTabState(
        storageNameSpace
    )

    const setName = name => editTab(state.activeTab, { name })
    const setQuery = query => editTab(state.activeTab, { query })
    const setResult = result => editTab(state.activeTab, { result })
    const setType = type => editTab(state.activeTab, { type })

    return {
        activeTab: state.activeTab,
        tabs: state.tabs,
        setQuery,
        setResult,
        setType,
        setName,
        setActiveTab,
        addTab,
        removeTab,
    }
}
