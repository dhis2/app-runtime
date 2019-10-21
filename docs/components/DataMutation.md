# DataMutation Component

A thin wrapper around the [useDataMutation](hooks/useDataMutation.md) hook

## Basic Usage

```jsx
import { DataMutation } from '@dhis2/app-runtime'

// within a React component's JSX render tree
return (
    <DataMutation mutation={mutation}>
        {([mutate, { called, loading, error, data }]) => {
            /* child render funtion */
        }}
    </DataMutation>
)
```

## Input Props

|      Name      |              Type               |   Required   | Description                                                                                                                   |
| :------------: | :-----------------------------: | :----------: | ----------------------------------------------------------------------------------------------------------------------------- |
|  **mutation**  | [_Mutation_](types/Mutation.md) | **required** | The Mutation definition describing the requested operation                                                                    |
| **variables**  |            _Object_             |              | Variables to be passed to the dynamic portions of the mutation                                                                |
| **onComplete** |           _Function_            |              | Callback function to be called on successfull completion of the mutation. Called with the response data as the only argument. |
|  **onError**   |           _Function_            |              | Callback function to be called on failure of the mutation. Called with the error instance as the only argument.               |

## Render Function Props

The render function is called whenever the state of the mutation changes. It is called with a single argument, an array with two elements:

1. `mutate` - a function which can be called to trigger the mutation (for instance in an onClick callback)
2. `state` - an object containing the following properties:

|    Name     |                  Type                   | Description                                                                                                                                                                            |
| :---------: | :-------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **called**  |                _boolean_                | **true** if the mutation has been triggered through a call to the _fill in the blanks ;-)_                                                                                                            |
| **loading** |                _boolean_                | **true** if the data is not yet available and no error has yet been encountered                                                                                                        |
|  **error**  |     _Error_<br/>or<br/>_undefined_      | **undefined** if no error has occurred, otherwise the Error which was thrown                                                                                                           |
|  **data**   | _MutationResult_<br/>or<br/>_undefined_ | **undefined** if the data is loading or an error has occurred, otherwise a map from the name of each **QueryDefinition** defined in the **Query** to the resulting data for that query |
| **engine**  |  [_Data Engine_](advanced/DataEngine)   | A reference to the DataEngine instance                                                                                                                                                 |

## Example

```jsx
import React from 'react'
import { DataMutation } from '@dhis2/app-runtime'

const mutation = {
    resource: 'indicators',
    id: ({ id }) => id,
    type: 'delete',
}

export const DeleteButton = ({ indicatorId, onDelete }) => (
    <DataMutation
        mutation={mutation}
        variables={{ id: indicatorId }}
        onComplete={onDelete}
    >
        {([mutate, { called, loading }]) => (
            <button disabled={called && loading} onClick={mutate}>
                Delete
            </button>
        )}
    </DataMutation>
)
```
