# Hooks

The DHIS2 Application Runtime supports [React Hooks](https://reactjs.org/docs/hooks-intro.html) (introduced in React 16.8). The following hooks are supported:

-   [**useConfig**](./useConfig.md) - Access the raw application configuration object
-   [**useDataQuery**](./useDataQuery.md) - Fetch data from the DHIS2 Core server API without worrying about HTTP requests!
-   [**useDataMutation**](./useDataMutation.md) - Mutate resources in the DHIS2 Core server API without worrying about HTTP requests!
-   [**useDataEngine**](./useDataEngine.md) _(Advanced)_ - Access the underlying [Data Engine](../advanced/DataEngine.md) instance
-   [**useAlert**](./useAlert.md) - Add an alert to the central alerts-context
-   [**useAlerts**](./useAlerts.md) - Read the alerts from the alerts-context

While these Hooks are incredibly powerful and usually preferable, some [Components](../components/README.md) are also provided which conveniently wrap their corresponding Hooks.
