import React, { useState } from 'react'

export const useStaticInput = <T>(
    staticValue: T,
    name: string = 'input'
): [T, React.Dispatch<T>] => {
    const [value, setValue] = useState<T>(() => staticValue)
    if (value !== staticValue) {
        console.warn(
            `The ${name} should be static, don't create it within the render loop!`
        )
    }
    return [value, setValue]
}
