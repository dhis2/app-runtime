# useDataMutation Hook

Declaratively define data mutations and respond to `loading` / `error` / `data` state changes.

## Basic Usage:

```jsx
import { useDataMutation } from '@dhis2/app-runtime'

// Within a functional component body
const [mutate, { called, loading, error, data }] = useDataMutation(mutation)
```

## Input

|     Name     |              Type               | Description                                             |
| :----------: | :-----------------------------: | ------------------------------------------------------- |
| **mutation** | [_Mutation_](types/Mutation.md) | The Mutation definition describing the requested action |

## Output

|    Name     |                 Type                 | Description                                                                                                                                                                            |
| :---------: | :----------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **mutate**  |              _Function_              | This function can be called to execute the mutation. Any in-flight HTTP requests will automatically be aborted.                                                                        |
| **called**  |              _boolean_               | **true** if the mutation has been triggered                                                                                                                                            |
| **loading** |              _boolean_               | **true** if the data is not yet available and no error has yet been encountered                                                                                                        |
|  **error**  |    _Error_<br/>or<br/>_undefined_    | **undefined** if no error has occurred, otherwise the Error which was thrown                                                                                                           |
|  **data**   | _QueryResult_<br/>or<br/>_undefined_ | **undefined** if the data is loading or an error has occurred, otherwise a map from the name of each **QueryDefinition** defined in the **Query** to the resulting data for that query |

## Example

> Coming soon
