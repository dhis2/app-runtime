import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, { useEffect, useCallback, useContext, useState } from 'react'
import {
    GlobalStateStore,
    GlobalStateStoreMutateMethod,
    GlobalStateMutation,
    GlobalStateStoreMutationCreator,
} from '../types'

// This file creates a redux-like state management service using React context
// that minimizes unnecessary rerenders that consume the context.
// See more at https://github.com/amcgee/state-service-poc

const identity = state => state

export const createStore = (initialState = {}): GlobalStateStore => {
    const subscriptions: Set<(state: any) => void> = new Set()
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

export const GlobalStateProvider = ({
    store,
    children,
}: {
    store: GlobalStateStore
    children: React.ReactNode
}): JSX.Element => (
    <GlobalStateContext.Provider value={store}>
        {children}
    </GlobalStateContext.Provider>
)
GlobalStateProvider.propTypes = {
    children: PropTypes.node,
    store: PropTypes.shape({}),
}

export const useGlobalState = (
    selector = identity
): [any, GlobalStateStoreMutateMethod] => {
    const store = useGlobalStateStore()
    const [selectedState, setSelectedState] = useState(
        selector(store.getState())
    )

    useEffect(() => {
        // NEW: deep equality check before updating
        const callback = state => {
            const newSelectedState = selector(state)
            // Second condition handles case where a selected object gets
            // deleted, but state does not update
            if (
                !isEqual(selectedState, newSelectedState) ||
                selectedState === undefined
            )
                setSelectedState(newSelectedState)
        }
        store.subscribe(callback)
        return () => store.unsubscribe(callback)
    }, [store]) /* eslint-disable-line react-hooks/exhaustive-deps */

    return [selectedState, store.mutate]
}

export function useGlobalStateMutation<Type>(
    mutationCreator: GlobalStateStoreMutationCreator<Type>
): GlobalStateMutation<Type> {
    const store = useGlobalStateStore()
    return useCallback(
        (...args) => {
            store.mutate(mutationCreator(...args))
        },
        [mutationCreator, store]
    )
}
