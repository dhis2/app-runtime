import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, { useEffect, useCallback, useContext, useState } from 'react'

// This file creates a redux-like state management service using React context
// that minimizes unnecessary rerenders that consume the context.
// See more at https://github.com/amcgee/state-service-poc

const identity = state => state

export const createStore = (initialState = {}) => {
    const subscriptions = new Set()
    let state = initialState

    return {
        getState: () => state,
        subscribe: callback => {
            subscriptions.add(callback)
        },
        unsubscribe: callback => {
            subscriptions.delete(callback)
        },
        mutate: mutation => {
            state = mutation(state)
            for (const callback of subscriptions) {
                callback(state)
            }
        },
    }
}

const GlobalStateContext = React.createContext(createStore())
const useGlobalStateStore = () => useContext(GlobalStateContext)

export const GlobalStateProvider = ({ store, children }) => (
    <GlobalStateContext.Provider value={store}>
        {children}
    </GlobalStateContext.Provider>
)
GlobalStateProvider.propTypes = {
    children: PropTypes.node,
    store: PropTypes.shape({}),
}

export const useGlobalState = (selector = identity) => {
    const store = useGlobalStateStore()
    const [selectedState, setSelectedState] = useState(
        selector(store.getState())
    )

    useEffect(() => {
        // NEW: deep equality check before updating
        const callback = state => {
            const newSelectedState = selector(state)
            if (!isEqual(selectedState, newSelectedState))
                setSelectedState(newSelectedState)
        }
        store.subscribe(callback)
        return () => store.unsubscribe(callback)
    }, [store]) /* eslint-disable-line react-hooks/exhaustive-deps */

    return [selectedState, store.mutate]
}

export const useGlobalStateMutation = mutationCreator => {
    const store = useGlobalStateStore()
    return useCallback(
        (...args) => {
            store.mutate(mutationCreator(...args))
        },
        [mutationCreator, store]
    )
}
