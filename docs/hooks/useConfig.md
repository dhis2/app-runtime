# useConfig Hook

Access the application configuration passed to the top-level [Provider](../provider.md)

## Basic Usage:

```jsx
import { useConfig } from '@dhis2/app-runtime'

// Within a functional component body
const { baseUrl } = useConfig()
```

## Input

_None_

## Output

This hook returns an object of type [Config](../types/Config.md).

## Example

```jsx
import React from 'react'
import { useConfig } from '@dhis2/app-runtime'

export const MyComponent = () => {
    const { baseUrl } = useConfig()
    return (
        <div>
            <span>
                <strong>Base URL</strong> : {baseUrl}
            </span>
        </div>
    )
}
```
