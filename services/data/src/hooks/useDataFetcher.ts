import { useState, useCallback, useRef, useContext, useEffect } from 'react'

import { joinPath } from '../utils/path'
import { DataContext } from '../components/DataContext'

import { QueryVariables } from '../types/Query'
import { FetchError } from '../types/FetchError'
import { ContextType } from '../types/Context'
import { JsonValue } from '../types/JsonValue'
import {
    FetchType,
    FetchDetails,
    FetcherInput,
    FetcherResult,
    RefetchFunction,
} from '../types/DataFetcher'

const getMethod = (type: FetchType): string => {
    switch (type) {
        case 'create':
            return 'POST'
        case 'read':
            return 'GET'
        case 'update':
            return 'PATCH'
        case 'replace':
            return 'POST'
        case 'delete':
            return 'DELETE'
    }
}

interface FetchDataInput {
    context: ContextType
    details: FetchDetails
    variables: QueryVariables
    signal: AbortSignal
}
const fetchData = ({
    context,
    details: { type, resource, id, body, params },
    variables,
    signal,
}: FetchDataInput): Promise<JsonValue> => {
    if (typeof id === 'function') id = id(variables)
    if (typeof body === 'function') body = body(variables)

    const resolvedParams = {
        ...params,
    }
    Object.entries(resolvedParams).forEach(([key, value]) => {
        if (typeof value === 'function') {
            resolvedParams[key] = value(variables)
        }
    })

    const q = {
        resource: id ? joinPath(resource, id) : resource,
        ...resolvedParams,
    }

    return context.fetch(q, {
        method: getMethod(type),
        body: body ? JSON.stringify(body) : null,
        headers: body
            ? {
                  'Content-Type': 'application/json',
              }
            : undefined,
        signal,
    })
}

const empty = {}
export const useDataFetcher = ({
    details,
    variables: initialVariables = empty,
    singular = false,
    immediate = false,
    transformData = x => x,
    onCompleted,
    onError,
}: FetcherInput): FetcherResult => {
    const context = useContext(DataContext)

    const [called, setCalled] = useState(immediate ? true : false)
    const [loading, setLoading] = useState(immediate ? true : false)
    const [error, setError] = useState<FetchError | undefined>(undefined)
    const [data, setData] = useState<any>(undefined)

    const variables = useRef(initialVariables)

    const abortControllersRef = useRef<AbortController[]>([])
    const abort = () => {
        abortControllersRef.current.forEach(controller => controller.abort())
        abortControllersRef.current = []
    }

    const refetch: RefetchFunction = useCallback(
        newVariables => {
            if (!immediate) {
                setCalled(true)
                setLoading(true)
            }

            if (singular) {
                abort() // Cleanup any in-progress fetches
            }
            const controller = new AbortController()
            abortControllersRef.current.push(controller)

            variables.current = {
                ...variables.current,
                ...newVariables,
            }

            return Promise.all(
                details.map(d =>
                    fetchData({
                        context,
                        details: d,
                        variables: variables.current,
                        signal: controller.signal,
                    })
                )
            )
                .then((data: JsonValue[]) => {
                    if (!controller.signal.aborted) {
                        const result = transformData(data)
                        setLoading(false)
                        setData(result)
                        onCompleted && onCompleted(result)
                        return result
                    }
                    return new Promise<JsonValue>(() => {})
                })
                .catch((error: FetchError) => {
                    if (!controller.signal.aborted) {
                        setLoading(false)
                        setError(error)
                        onError && onError(error)
                        console.warn('Ignored fetch error', error)
                    }
                    return new Promise<JsonValue>(() => {})
                })
        },
        [
            context,
            details,
            immediate,
            onCompleted,
            onError,
            singular,
            transformData,
        ]
    )

    useEffect(() => {
        if (immediate) {
            refetch()
        }
        return abort
    }, [immediate, refetch])

    return { refetch, abort, called, loading, error, data }
}
