# Mutation

The Mutation type is used to define declarative data mutations. It is required input for the [useDataMutation](hooks/useDataMutation.md) hook, [DataMutation](components/DataMutation.md) component, and [DataEngine.mutate](advanced/DataEngine) method.

A mutation defines a destructive operation performed on a collection or instance of a particular resource.

## Properties

|   Property   |              Type              |              | Description                                                                                                                                                |
| :----------: | :----------------------------: | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   **type**   |            _string_            | **required** | The type of mutation to perform, must be one of `create`, `update`, or `delete`.                                                                           |
| **resource** |            _string_            | **required** | The path to the resource being requested, i.e. `indicators`.                                                                                               |
|    **id**    | _string_ **or** _() => string_ |              | Required for `update` and `delete` mutations, not allowed for `create` mutations. Indicates that a particular **instance** of a collection will be mutated |
| **partial**  |           _boolean_            |              | If performing an `update` mutation, set `partial: true` to replace only the provided fields of the target object.                                          |
|  **params**  | _Object_ **or** _() => Object_ |              | A dictionary of properties which are translated into querystring parameters when the data is fetched                                                       |
|   **data**   | _Object_ **or** _() => Object_ |              | The "body" of the mutation, the content of the newly created or updated resource. Disallowed for `delete` mutations                                        |

> See the [Mutation type definition](https://github.com/dhis2/app-runtime/blob/master/services/data/src/engine/types/Mutation.ts) for more information

## Examples

Delete an existing indicator

```js
const deleteMutation = {
    type: 'delete',
    resource: 'indicators',
    id: 'xyz123',
}
```

Update an existing indicator, only overwriting the `name` property

```js
const updateMutation = {
    type: 'update',
    partial: true,
    resource: 'indicators',
    id: 'xyz123',
    data: {
        name: 'MyNewName',
    },
}
```

Create a new indicator, accepting the `name` as a variable, allowing it to be specified at the time the mutation is executed

```js
const dynamicCreateMutation = {
    type: 'create',
    resource: 'indicators',
    data: ({ name }) => ({
        name,
        shortName: name,
        indicatorType: {
            id: 'bWuNrMHEoZ0',
        },
        numerator: '#{fbfJHSPpUQD}',
        denominator: '#{h0xKKjijTdI}',
    }),
}
```
