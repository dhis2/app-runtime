# DataQuery Component

A thin wrapper around the [useDataQuery](hooks/useDataQuery.md) hook

## Basic Usage

```jsx
import { DataQuery } from '@dhis2/app-runtime'

// within a React component's JSX render tree
<DataQuery query={query}>
    {({ loading, error, data, refetch }) => {
        /* child render funtion */
    }}
</DataQuery>
```

## Input Props

| Name | Type | Description |
|:--------:|:----:|-------------|
| **query** | [*Query*](types/Query.md) | The Query definition describing the requested data |

## Render Function Props

| Name | Type | Description |
|:--------:|:----:|-------------|
| **loading** | *boolean* | **true** if the data is not yet available and no error has yet been encountered |
| **error** | *Error*<br/>or<br/>*undefined* | **undefined** if no error has occurred, otherwise the Error which was thrown |
| **data** | *QueryResult*<br/>or<br/>*undefined* | **undefined** if the data is loading or an error has occurred, otherwise a map from the name of each **QueryDefinition** defined in the **Query** to the resulting data for that query |
| **refetch** | *Function* | This function can be called to refetch the data.  Any in-flight HTTP requests will automatically be aborted. |

## Example

```jsx
import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    indicators: {
        resource: 'indicators.json',
        params: {
            order: 'shortName:desc',
            pageSize: 10,
        }
    },
}
export const IndicatorList = () => (
    <DataQuery query={query}>
        {({ loading, error, data }) => (
            <h3>Indicators (first 10)</h3>
            {loading && <span>...</span>}
            {error && <span>{`ERROR: ${error.message}`}</span>}
            {data && (
                <pre>
                    {data.indicators.indicators
                        .map(ind => ind.displayName)
                        .join('\n')}
                </pre>
            )}
        )}
    </DataQuery>
)
```
