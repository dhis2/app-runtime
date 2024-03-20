# Plugin Component

:::info Experminental
This component is experimental and is available for import from `@dhis2/app-runtime/experimental`. The api for this component is not guaranteed to be stable.
:::

A wrapper that creates an iframe for a specified plugin and establishes a two-way communication channel with said plugin, allowing you to pass props (including callbacks between an app and a plugin). Note that the plugin must be built using the app-platform with entryPoints.plugin specified in the d2.config.js file.

## Basic Usage (Defining a plugin within an app)

Within an app you can specify a plugin (either by providing its short name `pluginShortName`, or by specifying a URL directly (`pluginSource`). If you have provided `pluginSource`, this will take precedence.

```jsx
import { Plugin } from '@dhis2/app-runtime/experimental'

// within the app
const MyApp = () => (
    <Plugin
        pluginShortName={mutation}
        onError={(err) => {
            console.error(err)
        }}
        showAlertsInPlugin={true}
        numberToPass={'42'}
        callbackToPass={({ name }) => {
            console.log(`Hi ${name}!`)
        }}
    />
)
```

## Basic Usage (Using properties from the parent app)

You must build your plugin with the app-platform. If you have done this, your entry component will be passed the props from the parent app. From the example above, the properties `numberToPass` and `callbackToPass` will be available in the build plugin (when it is rendered with a `<Plugin>` component).

```jsx
// your plugin entry point (the plugin itself)

const MyPlugin = (propsFromParent) => {
    const { numberToPass, callbackToPass: sayHi } = propsFromParent
    return (
        <>
            <p>{`The meaning of life is: ${numberToPass}`}</p>
            <button onClick={() => sayHi({ name: 'Arthur Dent' })}>
                Say hi
            </button>
        </>
    )
}
```

## Plugin Props (reserved props)

|          Name          |      Type      |                    Required                     | Description                                                                                                                                                                                                                                                                                  |
| :--------------------: | :------------: | :---------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **pluginShortName**   |    _string_    |  _required_ if `pluginSource` is not provided   | The shortName of the app/plugin you wish to load (matching the result from api/apps). Used to look up the plugin entry point. If this is not provided, `pluginSource` must be provided. `pluginSource` will take precedence if provided.                                                     |
|    **pluginSource**    | _string_ (url) | _required_ if `pluginShortName` is not provided | The URL of the plugin. If this is not provided, `pluginShortName` must be provided.                                                                                                                                                                                                          |
|      **onError**       |   _Function_   |                   _optional_                    | Callback function to be called when an error in the plugin triggers an error boundary. You can use this to pass an error back up to the app and create a custom handling/UX if errors occur in the plugin. In general, it is recommended that you use the plugin's built-in error boundaries |
| **showAlertsInPlugin** |   _boolean_    |                   _optional_                    | If `true`, any alerts within the plugin (defined with the `useAlert` hook) will be rendered within the iframe. By default, this is `false`. It is recommended, in general, that you do not override this and allow alerts to be hoisted up to the app level                                  |
|       **height**       |    _number_    |                   _optional_                    | If a height is provided, the iframe will be fixed to the specified height. If no height is provided, the iframe will automatically resize based on its contents.                                                                                                                             |
|       **width**        |    _number_    |                   _optional_                    | If a width is provided, the iframe will be fixed to the specified width. If no width is provided, the iframe will automatically resize based on its contents.                                                                                                                                |

## Plugin Props (custom props)

You can specify pass any other props on the `<Plugin>` component and these will be passed down to the plugin (provided it was built with app-platform). When props are updated, they will be passed back down to the plugin. This mimics the behaviour of a normal React component, and hence you should provide stable references as needed to prevent rerendering.

## Extended example

See these links for an extended example of how `<Plugin>` component can be used within an [app](https://github.com/tomzemp/workingplugin/blob/plugin-wrapper-in-platform/src/App.js) and consumed within the [plugin](https://github.com/tomzemp/workingplugin/blob/plugin-wrapper-in-platform/src/Plugin.js).
