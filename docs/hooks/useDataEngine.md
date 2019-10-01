# useDataEngine hook

Get access to the [Data Engine](advanced/DataEngine) instance for non-React contexts.

## Basic Usage:

```jsx
import { useDataEngine } from '@dhis2/app-runtime'

// Within a functional component body
const engine = useDataEngine()

// later...
engine.query(query)
engine.mutate(mutation, {
    variables: {
        id: 'xyz123',
    },
})
```

> See [Using with Redux](advanced/redux) for an advanced example
