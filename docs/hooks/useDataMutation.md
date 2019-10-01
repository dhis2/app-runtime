# useDataMutation Hook

Declaratively define data mutations and respond to `loading` / `error` / `data` state changes.

## Basic Usage:

```jsx
import { useDataMutation } from '@dhis2/app-runtime'

// Within a functional component body
const [mutate, { called, loading, error, data }] = useDataMutation(mutation)
```

## Input

|      Name      |              Type               | Description                                             |
| :------------: | :-----------------------------: | ------------------------------------------------------- |
|  **mutation**  | [_Mutation_](types/Mutation.md) | The Mutation definition describing the requested action |
| **variables**  |            _Object_             |                                                         | Variables to be passed to the dynamic portions of the mutation |
| **onComplete** |           _Function_            |                                                         | Callback function to be called on successfull completion of the mutation. Called with the response data as the only argument. |
|  **onError**   |           _Function_            |                                                         | Callback function to be called on failure of the mutation. Called with the error instance as the only argument. |

## Output

|    Name     |                 Type                 | Description                                                                                                                                                                            |
| :---------: | :----------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **mutate**  |              _Function_              | This function can be called to execute the mutation. Any in-flight HTTP requests will automatically be aborted.                                                                        |
| **called**  |              _boolean_               | **true** if the mutation has been triggered                                                                                                                                            |
| **loading** |              _boolean_               | **true** if the data is not yet available and no error has yet been encountered                                                                                                        |
|  **error**  |    _Error_<br/>or<br/>_undefined_    | **undefined** if no error has occurred, otherwise the Error which was thrown                                                                                                           |
|  **data**   | _QueryResult_<br/>or<br/>_undefined_ | **undefined** if the data is loading or an error has occurred, otherwise a map from the name of each **QueryDefinition** defined in the **Query** to the resulting data for that query |
| **engine**  | [_Data Engine_](advanced/DataEngine) | A reference to the DataEngine instance                                                                                                                                                 |

## Example

```jsx
import React from 'react'
import { useDataMutation } from '@dhis2/app-runtime'

const mutation = {
    resource: 'indicators',
    id: ({ id }) => id,
    type: 'delete',
}

export const DeleteButton = ({ indicatorId, onDelete }) => {
    const [mutate] = useDataMutation(mutation, {
        onComplete: onDelete,
        variables: {
            id: indicatorId,
        },
    })

    return <button onClick={mutate}>Delete</button>
}
```

> See [the Indicator component in the example app](https://github.com/dhis2/app-runtime/blob/master/examples/cra/src/components/Indicator.js) for an example of an `update` mutation

> See [the AddButton component in the example app](https://github.com/dhis2/app-runtime/blob/master/examples/cra/src/components/AddButton.js) for an example of an `create` mutation
