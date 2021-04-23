import { useCallback, useContext, useEffect, useState } from 'react'
import { OfflineContext } from '../context/OfflineContext'
import { AnyFunction } from '../types'

const debounce = (fn: AnyFunction, wait: number) => {
    let lastCalledArgs: any[] | undefined = undefined
    return (...args: any[]) => {
        if (lastCalledArgs) {
            lastCalledArgs = args
            return
        }

        lastCalledArgs = args
        setTimeout(() => {
            fn(...(lastCalledArgs || []))
            lastCalledArgs = undefined
        }, wait)
    }
}

export const useOnlineStatus = ({ debounceWait = 100 }) => {
    const context = useContext(OfflineContext)
    const [status, setStatus] = useState(context.getIsOnline())

    const callback = useCallback(
        () =>
            debounce((isOnline: boolean) => {
                setStatus(isOnline)
            }, debounceWait),
        [debounceWait]
    )

    useEffect(() => {
        const unsubscribe = context.subscribe('onlineStatusChange', callback)
        return unsubscribe
    }, [context, callback])

    return status
}
