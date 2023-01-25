import { useDataQuery } from '@dhis2/app-service-data'
import postRobot from 'post-robot'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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

    const [missingProps, setMissingProps] = useState<string[] | null>(null)

    const { data } = useDataQuery(appsInfoQuery)
    const pluginEntryPoint =
        pluginSource ??
        getPluginEntryPoint({
            apps: data?.apps || [],
            appShortName: pluginShortName,
        })

    const [communicationReceived, setCommunicationReceived] =
        useState<boolean>(false)

    const updateMissingProps = useCallback(
        (propsIdentified: string[] | null) => {
            if (propsIdentified?.join() !== missingProps?.join()) {
                setMissingProps(propsIdentified)
            }
        },
        [missingProps, setMissingProps]
    )

    useEffect(() => {
        if (iframeRef?.current) {
            const iframeProps = { ...propsToPass, updateMissingProps }

            // if iframe has not sent initial request, set up a listener
            if (!communicationReceived) {
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
            if (communicationReceived && iframeRef.current.contentWindow) {
                postRobot.send(
                    iframeRef.current.contentWindow,
                    'updated',
                    iframeProps
                )
            }
        }
    }, [propsToPass, communicationReceived, updateMissingProps])

    if (data && !pluginEntryPoint) {
        return (
            <PluginError
                missingEntryPoint={true}
                showDownload={false}
                appShortName={pluginShortName}
                missingProps={missingProps}
            />
        )
    }

    return (
        <>
            {/* if props are missing, keep iframe hidden so that it can received updated props  */}
            {missingProps && missingProps?.length > 0 && (
                <PluginError
                    missingEntryPoint={false}
                    showDownload={false}
                    appShortName={pluginShortName}
                    missingProps={missingProps}
                />
            )}
            {pluginEntryPoint ? (
                <iframe
                    ref={iframeRef}
                    src={pluginSource}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    hidden={Boolean(missingProps && missingProps?.length > 0)}
                ></iframe>
            ) : null}
        </>
    )
}
