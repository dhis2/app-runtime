import { AlertsManagerContext } from '@dhis2/app-service-alerts'
import { useDataQuery } from '@dhis2/app-service-data'
import postRobot from 'post-robot'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import PluginError from './PluginError'

const appsInfoQuery = {
    apps: {
        resource: 'apps',
    },
}

// sample logic subject to change depending on actual endpoint details
const getPluginEntryPoint = ({
    apps,
    appShortName,
}: {
    apps: any
    appShortName?: string
}): string => {
    return apps.find(
        ({ short_name }: { short_name: string }) =>
            short_name && short_name === appShortName
    )?.pluginLaunchUrl
}

export const Plugin = ({
    pluginSource,
    pluginShortName,
    ...propsToPassNonMemoized
}: {
    pluginSource?: string
    pluginShortName?: string
    propsToPass: any
}): JSX.Element => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // we do not know what is being sent in passed props, so for stable reference, memoize using JSON representation
    const propsToPassNonMemoizedJSON = JSON.stringify(propsToPassNonMemoized)
    const propsToPass = useMemo(
        () => ({ ...propsToPassNonMemoized }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [propsToPassNonMemoizedJSON]
    )
    const { height } = propsToPass

    const { add: alertsAdd } = useContext(AlertsManagerContext)

    const { data } = useDataQuery(appsInfoQuery)
    const pluginEntryPoint =
        pluginSource ??
        getPluginEntryPoint({
            apps: data?.apps || [],
            appShortName: pluginShortName,
        })

    const [communicationReceived, setCommunicationReceived] =
        useState<boolean>(false)

    const [inErrorState, setInErrorState] = useState<boolean>(false)
    const [pluginHeight, setPluginHeight] = useState<number>(150)

    useEffect(() => {
        if (height) {
            setPluginHeight(height)
        }
    }, [height])

    useEffect(() => {
        if (iframeRef?.current) {
            const iframeProps = {
                ...propsToPass,
                alertsAdd,
                setPluginHeight,
                setInErrorState,
                setCommunicationReceived,
            }

            // if iframe has not sent initial request, set up a listener
            if (!communicationReceived && !inErrorState) {
                const listener = postRobot.on(
                    'getPropsFromParent',
                    // listen for messages coming only from the iframe rendered by this component
                    { window: iframeRef.current.contentWindow },
                    (): any => {
                        setCommunicationReceived(true)
                        return iframeProps
                    }
                )
                return () => listener.cancel()
            }

            // if iframe has sent initial request, send new props
            if (
                communicationReceived &&
                iframeRef.current.contentWindow &&
                !inErrorState
            ) {
                postRobot
                    .send(
                        iframeRef.current.contentWindow,
                        'updated',
                        iframeProps
                    )
                    .catch((err) => {
                        // log postRobot errors, but do not bubble them up
                        console.error(err)
                    })
            }
        }
    }, [propsToPass, communicationReceived, inErrorState, alertsAdd])

    if (data && !pluginEntryPoint) {
        return (
            <PluginError
                missingEntryPoint={true}
                appShortName={pluginShortName}
            />
        )
    }

    if (pluginEntryPoint) {
        return (
            <div style={{ height: `${pluginHeight}px` }}>
                <iframe
                    ref={iframeRef}
                    src={pluginSource}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                ></iframe>
            </div>
        )
    }

    return <></>
}
