import { AlertsManagerContext } from '@dhis2/app-service-alerts'
import { useDataQuery } from '@dhis2/app-service-data'
import postRobot from 'post-robot'
import React, {
    ReactEventHandler,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
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
    onLoad,
    ...propsToPassNonMemoized
}: {
    pluginSource?: string
    pluginShortName?: string
    onLoad?: ReactEventHandler<HTMLIFrameElement>
    propsToPass: any
}): JSX.Element => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // we do not know what is being sent in passed props, so for stable reference, memoize using JSON representation
    const propsToPassNonMemoizedJSON = JSON.stringify(propsToPassNonMemoized)
    const propsToPass: any = useMemo(
        () => ({ ...propsToPassNonMemoized }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [propsToPassNonMemoizedJSON]
    )
    const { height, width } = propsToPass

    const { add: alertsAdd } = useContext(AlertsManagerContext)

    const { data } = useDataQuery(appsInfoQuery)
    const pluginEntryPoint =
        pluginSource ??
        getPluginEntryPoint({
            apps: data?.apps || [],
            appShortName: pluginShortName,
        })

    const [inErrorState, setInErrorState] = useState<boolean>(false)
    const [pluginHeight, setPluginHeight] = useState<string | number>('150px')
    const [pluginWidth, setPluginWidth] = useState<string | number>('500px')

    useEffect(() => {
        if (height) {
            setPluginHeight(height)
        }
        if (width) {
            setPluginWidth(width)
        }
    }, [height, width])

    // since we do not know what props are passed, the dependency array has to be keys of whatever is standard prop
    const memoizedPropsToPass = useMemo(
        () => propsToPass,
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            ...Object.keys(propsToPass)
                .sort()
                .map((k) => (propsToPass as any)[k]),
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    )

    const propsFromParentListenerRef = useRef<any>()
    const communicationReceivedRef = useRef<boolean>(false)

    const setUpCommunication = useCallback(() => {
        if (!iframeRef.current) {
            return
        }

        const iframeProps = {
            ...memoizedPropsToPass,
            alertsAdd,
            setPluginHeight,
            setPluginWidth,
            setInErrorState,
            // todo: what does this do? resets state from error component
            // seems to work without...
            // setCommunicationReceived,
        }

        // if iframe has not sent initial request, set up a listener
        if (!communicationReceivedRef.current && !inErrorState) {
            // avoid setting up twice
            if (!propsFromParentListenerRef.current) {
                propsFromParentListenerRef.current = postRobot.on(
                    'getPropsFromParent',
                    // listen for messages coming only from the iframe rendered by this component
                    { window: iframeRef.current.contentWindow },
                    (): any => {
                        communicationReceivedRef.current = true
                        return iframeProps
                    }
                )
            }
            // return clean-up function
            return () => {
                propsFromParentListenerRef.current.cancel()
                propsFromParentListenerRef.current = null
            }
        }

        // if iframe has sent initial request, send new props
        // (don't do before to avoid sending messages before listeners
        // are ready)
        if (iframeRef.current.contentWindow && !inErrorState) {
            postRobot
                .send(iframeRef.current.contentWindow, 'updated', iframeProps)
                .catch((err) => {
                    // log postRobot errors, but do not bubble them up
                    console.error(err)
                })
        }
    }, [memoizedPropsToPass, inErrorState, alertsAdd])

    useEffect(() => {
        // return the clean-up function
        return setUpCommunication()
    }, [setUpCommunication])

    const handleLoad = useCallback(
        (event) => {
            // reset communication received
            communicationReceivedRef.current = false
            if (propsFromParentListenerRef.current) {
                propsFromParentListenerRef.current.cancel()
                propsFromParentListenerRef.current = null
            }

            // Need to set this up again whenever the iframe contentWindow
            // changes (e.g. navigations or reloads)
            setUpCommunication()

            if (onLoad) {
                onLoad(event)
            }
        },
        [onLoad, setUpCommunication]
    )

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
            <div
                style={{
                    height: `${pluginHeight}`,
                    width: `${pluginWidth}`,
                }}
            >
                <iframe
                    ref={iframeRef}
                    src={pluginSource}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    onLoad={handleLoad}
                ></iframe>
            </div>
        )
    }

    return <></>
}
