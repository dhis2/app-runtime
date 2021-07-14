# CustomDataProvider

The [CustomDataProvider](https://github.com/dhis2/app-runtime/blob/master/services/data/src/react/components/CustomDataProvider.tsx) can be used to provide **static** or **custom** data to its children. This is useful for interactive documentation and unit tests.

## Options

The CustomDataProvider accepts four props:

-   children: a valid React node.
-   [data](https://github.com/dhis2/app-runtime/blob/master/services/data/src/links/CustomDataLink.ts#L15): an object that defines the replies for certain resources. See below for examples.
-   [options](https://github.com/dhis2/app-runtime/blob/master/services/data/src/links/CustomDataLink.ts#L18): an object with the keys `loadForever` and `failOnMiss`. Set `loadForever` to `true` to force queries to keep loading indefinitely. Set `failOnMiss` to `true` to throw an error for any requests that have no matching reply defined in `data`
-   queryClientOptions: allows you to override the default queryClientOptions, see the [react-query docs](https://react-query.tanstack.com/reference/QueryClient) for the format and available options.

## Static replies

The below example will reply with `reply` to all queries for the `resourceName` resource. Naturally this will only apply to queries executed from descendants of the CustomDataProvider.

```jsx
<CustomDataProvider data={{ resourceName: 'reply' }}>
    {children}
</CustomDataProvider>
```

## Dynamic replies

Instead of defining a static response it is also possible to supply a function. This allow you to define dynamic responses for a resource. The example below will reply with a random number for each request to the `resourceName` resource.

```jsx
<CustomDataProvider
    data={{ resourceName: (type, query, options) => Math.random() }}
>
    {children}
</CustomDataProvider>
```

The supplied callback will be called with three arguments, namely:

-   [type](https://github.com/dhis2/app-runtime/blob/master/services/data/src/engine/types/ExecuteOptions.ts#L4)
-   [query](https://github.com/dhis2/app-runtime/blob/master/services/data/src/engine/types/Query.ts#L15)
-   [options](https://github.com/dhis2/app-runtime/blob/master/services/data/src/engine/types/DataEngineLink.ts#L5)
