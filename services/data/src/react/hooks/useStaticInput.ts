import React, { useState, useEffect, useRef, useDebugValue } from 'react'

interface StaticInputOptions {
    warn?: boolean
    name?: string
}
export const useStaticInput = <T>(
    staticValue: T,
    { warn = false, name = 'input' }: StaticInputOptions = {}
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const originalValue = useRef(staticValue)
    const [value, setValue] = useState<T>(() => originalValue.current)

    useDebugValue(value, debugValue => `${name}: ${JSON.stringify(debugValue)}`)

    useEffect(() => {
        if (warn && originalValue.current !== staticValue) {
            console.warn(
                `The ${name} should be static, don't create it within the render loop!`
            )
        }
    }, [warn, staticValue, originalValue, name])
    return [value, setValue]
}
