# Data Queries

The Query type is used to define declarative data requests. It is required input for the [useDataQuery](hooks/useDataQuery.md) hook and [DataQuery](components/DataQuery.md) component.

## Query

A query is a map of names to **QueryDefinition** objects. The name can be any string. Multiple **QueryDefinition** components of a single **Query** will be fetched in parallel if possible.

i.e.

```js
const query = {
    myData: {
        resource: 'indicators',
    },
}
```

## QueryDefinition

|   Property   |              Type              |              | Description                                                                                          |
| :----------: | :----------------------------: | ------------ | ---------------------------------------------------------------------------------------------------- |
| **resource** |            _string_            | **required** | The path to the resource being requested, i.e. `indicators`.                                         |
|    **id**    | _string_ **or** _() => string_ |              | Optional, when specified indicates that a particular **instance** of a collection will be requested  |
|  **params**  | _Object_ **or** _() => Object_ |              | A dictionary of properties which are translated into querystring parameters when the data is fetched |

> See the [Query type definition](https://github.com/dhis2/app-runtime/blob/master/services/data/src/engine/types/Query.ts) for more information
