# Data Queries

The Query type is used to define declarative data requests.  It is required input for the [useDataQuery](hooks/useDataQuery.md) hook and [DataQuery](components/DataQuery.md) component.

## Query

A query is a map of names to **QueryDefinition** objects.  The name can be any string.  Multiple **QueryDefinition** components of a single **Query** will be fetched in parallel if possible.

i.e.

```js
const query = {
    myData: {
        resource: 'indicators'
    }
}
```

## QueryDefinition

| Property | Type |  | Description |
|:--------:|:----:|--|-------------|
| **resource** | *string* | **required**| The path to the resource being requested, i.e. `indicators` or `indicatore/1234`. |
| **\*** | *any* | | Any additional properties are translated into querystring parameters when the data is fetched |

> See the [Query type definition](https://github.com/dhis2/app-runtime/blob/master/services/data/src/types/Query.d.ts) for more information