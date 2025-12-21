# useCurrentUserInfo Hook

Access the current authenticated DHIS2 user's information from the [Provider](../provider.md)

## Basic Usage:

```jsx
import { useCurrentUserInfo } from '@dhis2/app-runtime'

// Within a functional component body
const user = useCurrentUserInfo()
```

## Input

_None_

## Output

This hook returns an object of type [CurrentUser](../types/CurrentUser.md)

## Example

```jsx
import React from 'react'
import { useCurrentUserInfo } from '@dhis2/app-runtime'

export const MyComponent = () => {
    const user = useCurrentUserInfo()
    return (
        <div>
            <span>
                <strong>Display Name</strong> : {user.displayName}
            </span>
            <span>
                <strong>Username</strong> : {user.username}
            </span>
        </div>
    )
}
```
