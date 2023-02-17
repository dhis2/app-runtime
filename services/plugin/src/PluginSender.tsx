import { AlertsManagerContext } from '@dhis2/app-service-alerts'
import { useDataQuery } from '@dhis2/app-service-data'
import postRobot from 'post-robot'
import React, { useContext, useEffect, useRef, useState } from 'react'
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

export const PluginSender = ({
    pluginSource,
    pluginShortName,
    ...propsToPass
}: {
    pluginSource?: string
    pluginShortName?: string
    propsToPass: any
}): JSX.Element => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

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

    useEffect(() => {
        if (iframeRef?.current) {
            const iframeProps = {
                ...propsToPass,
                alertsAdd,
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
            <iframe
                ref={iframeRef}
                src={pluginSource}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            ></iframe>
        )
    }

    return <></>
}
