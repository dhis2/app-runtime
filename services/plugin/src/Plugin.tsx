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
    height,
    width,
    className,
    clientWidth,
    ...propsToPassNonMemoized
}: {
    pluginSource?: string
    pluginShortName?: string
    height?: string | number
    width?: string | number
    className?: string
    clientWidth?: string | number
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
    const [prevCommunicationReceived, setPrevCommunicationReceived] =
        useState<boolean>(false)

    const [inErrorState, setInErrorState] = useState<boolean>(false)
    // height and width values to be set by callbacks passed to the plugin
    // (these default sizes will be quickly overwritten by the plugin)
    // in order to behave like a normal block element, by default, the height
    // will be set by plugin contents, this state will be used
    const [resizedHeight, setPluginHeight] = useState<number>(150)
    // ...and by default, plugin width will be defined by the container
    // (width = 100%), so this state won't be used unless the `clientWidth`
    // prop is used to have plugin width defined by plugin contents
    const [resizedWidth, setPluginWidth] = useState<number>(500)

    // since we do not know what props are passed, the dependency array has to be keys of whatever is standard prop
    // we exclude height/width from memoization to avoid updates for these properties
    const memoizedPropsToPass = useMemo(
        () => propsToPassNonMemoized,
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            ...Object.keys(propsToPassNonMemoized)
                .sort()
                .map((k) => (propsToPassNonMemoized as any)[k]),
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    )

    useEffect(() => {
        setCommunicationReceived(false)
    }, [pluginEntryPoint])

    useEffect(() => {
        // if communicationReceived switches from false to true, the props have been sent
        const prevCommunication = prevCommunicationReceived
        setPrevCommunicationReceived(communicationReceived)
        if (prevCommunication === false && communicationReceived === true) {
            return
        }

        if (iframeRef?.current) {
            const iframeProps = {
                ...memoizedPropsToPass,
                alertsAdd,
                // if a dimension is specified or container driven, don't send
                // a resize callback to the plugin
                setPluginHeight: !height ? setPluginHeight : null,
                setPluginWidth: !width && clientWidth ? setPluginWidth : null,
                setInErrorState,
                setCommunicationReceived,
                clientWidth,
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
        // prevCommunicationReceived update should not retrigger this hook
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memoizedPropsToPass, communicationReceived, inErrorState, alertsAdd])

    if (data && !pluginEntryPoint) {
        return (
            <PluginError
                missingEntryPoint={true}
                appShortName={pluginShortName}
            />
        )
    }

    if (!pluginEntryPoint) {
        return <></>
    }

    return (
        <iframe
            ref={iframeRef}
            src={pluginSource}
            className={className}
            // if clientWidth is set, then we want width to be set by plugin.
            // otherwise, use a specified width, or 100% by default
            width={clientWidth ? resizedWidth : width ?? '100%'}
            height={height ?? resizedHeight}
            style={{ border: 'none' }}
        />
    )
}
