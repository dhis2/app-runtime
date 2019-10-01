# Usage with Redux

The `useDataEngine` hook can be used to wrap a Redux store and pass the engine to, for example, the [Redux thunk middleware](https://github.com/reduxjs/redux-thunk).

## Example

This is one example of how to integrate the Data Engine with Redux - some pieces of the application (like reducers, App components, etc.) are ommitted for brevity

> **NB** this is a contrived example, the same can (and probably should) be achieved with just `useDataQuery` calls in a React component. This also duplicates cached data in the redux store, which could lead to stale data or bifricated logic. Chaining mutations is probably a better use-case.

```jsx
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { createStore } from 'redux'
import ReduxThunk from 'redux-thunk'
import { useDataEngine } from '@dhis2/app-runtime'

import App from './components/App'
import rootReducer from './reducers/index'

const AppWrapper = () => {
    const engine = useDataEngine()
    const store = useMemo(
        () =>
            createStore(
                rootReducer,
                applyMiddleware(ReduxThunk.withExtraArgument(engine))
            ),
        [engine]
    )

    return (
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
    )
}

export default AppWrapper
```

You can then use the `engine` to trigger queries or mutations from within your Redux thunks!

```js

/* actionCreators */
function setOrgUnitName(name) {
    return {
        type: 'SET_ORG_UNIT_NAME',
        name: name
    }
}
function setNoOrgUnit() {
    return {
        type: 'SET_NO_ORG_UNIT'
    }
}

/* queries */
const userQuery = {
    user: {
        resource: 'me',
        params: {
            fields: ['organisationUnits']
        }
    }
}
const orgUnitQuery = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: {
            fields: ['displayName']
        }
    }
}

/* thunk action creator */
export function fetchUserOrgUnitName(id) {
  return async (dispatch, getState, engine) => {
    const { user } = await engine.query(userQuery)
    if (!user.organisationUnits.length) {
        dispatch(setNoOrgUnit())
    }
    const { orgUnit } = await engine.query(orgUnitQuery, {
        variables: { id: user.organisationUnits[0].id }
    })
    dispatch(setOrgUnitName(orgUnit.displayName)))
  };
}
```
