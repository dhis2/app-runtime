# useDataQuery Hook

Declaratively define data dependencies and respond to `loading` / `error` / `data` state changes.

## Basic Usage:

```jsx
import { useDataQuery } from '@dhis2/app-runtime'

// Within a functional component body
const { loading, error, data, refetch } = useDataQuery(query, options)
```

## Input

|          Name          |             Type             |   Required   | Description                                                                                                                 |
| :--------------------: | :--------------------------: | :----------: | --------------------------------------------------------------------------------------------------------------------------- |
|       **query**        | [_Query_](../types/Query.md) | **required** | The Query definition describing the requested data                                                                          |
|      **options**       |           _Object_           |              | An optional set of query options                                                                                            |
| **options.variables**  |           _Object_           |              | Variables to be passed to the dynamic portions of the query (can also be passed via the refetch function, see Output below) |
| **options.onComplete** |          _Function_          |              | Callback function to be called on successfull completion of the query. Called with the response data as the only argument.  |
|  **options.onError**   |          _Function_          |              | Callback function to be called on failure of the query. Called with the error instance as the only argument.                |
|    **options.lazy**    |          _boolean_           |              | If true, wait until `refetch` is called before fetching data.<br/>_**Default**: `false`_                                    |

## Output

|    Name     |                    Type                    | Description                                                                                                                                                                            |
| :---------: | :----------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **called**  |                 _boolean_                  | **true** if the data request has been initiated with either `lazy: false` or `refetch()` at least once                                                                                 |
| **loading** |                 _boolean_                  | **true** if the data is not yet available and no error has yet been encountered                                                                                                        |
| **fetching** | _boolean_ | **true** if the hook is actively making a request for data in the background. Unlike `loading`, which can only be **true** *if there is no data received yet*, `fetching` can be true if there is data available. |
|  **error**  |       _Error_<br/>or<br/>_undefined_       | **undefined** if no error has occurred, otherwise the Error which was thrown                                                                                                           |
|  **data**   |    _QueryResult_<br/>or<br/>_undefined_    | **undefined** if the data is loading or an error has occurred, otherwise a map from the name of each **QueryDefinition** defined in the **Query** to the resulting data for that query |
| **refetch** |                 _Function_                 | This function can be called to refetch the data and can accept variables (see Examples below). Any in-flight HTTP requests will automatically be aborted.                              |
| **engine**  | [_Data Engine_](../advanced/DataEngine.md) | A reference to the DataEngine instance                                                                                                                                                 |

## Examples

### Static query

This is a minimal example showing how to fetch the first page of indicators with a descending order.

```jsx
import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'

const PAGE_SIZE = 10
const query = {
    indicators: {
        resource: 'indicators.json',
        params: {
            order: 'shortName:desc',
            pageSize: PAGE_SIZE,
        },
    },
}
export const IndicatorList = () => {
    const { loading, error, data } = useDataQuery(query)
    return (
        <div>
            <h3>Indicators (first 10)</h3>
            {loading && <CircularLoader />}
            {error && <span>{`ERROR: ${error.message}`}</span>}
            {data && (
                <pre>
                    {data.indicators.indicators
                        .map((ind) => ind.displayName)
                        .join('\n')}
                </pre>
            )}
        </div>
    )
}
```

### Dynamic Query

This example is similar to the previous one but builds on top of it by showing how to fetch new pages of data using dynamic variables. A similar approach can be used implement dynamic filtering, ordering, etc.

```jsx
import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Pagination, CircularLoader } from '@dhis2/ui'

const PAGE_SIZE = 10
const query = {
    // "page" variable below can be dinamically passed via refetch (see "handlePageChange" below)
    indicators: {
        resource: 'indicators.json',
        params: ({ page }) => ({
            order: 'shortName:desc',
            pageSize: PAGE_SIZE,
            page,
        }),
    },
}

export const IndicatorList = () => {
    const { loading, error, data, refetch } = useDataQuery(query)

    const pager = data?.indicators?.pager
    const hasNextPage = pager?.nextPage

    const handlePageChange = (nextPage) => {
        // "page" variable in query is passed via refetch below
        refetch({ page: nextPage })
    }

    return (
        <div>
            <h3>Indicators (paginated)</h3>
            {loading && <CircularLoader />}
            {error && <span>{`ERROR: ${error.message}`}</span>}
            {data && (
                <pre>
                    {data.indicators.indicators
                        .map((ind) => ind.displayName)
                        .join('\n')}
                </pre>
            )}

            {pager && (
                <Pagination
                    page={pager.page}
                    pageCount={pager.pageCount}
                    pageSize={PAGE_SIZE}
                    total={pager.total}
                    isLastPage={hasNextPage}
                    onPageChange={handlePageChange}
                    hidePageSizeSelect={true}
                />
            )}
        </div>
    )
}
```
