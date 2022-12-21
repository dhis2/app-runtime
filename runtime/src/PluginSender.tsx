import postRobot from 'post-robot'
import React, { useEffect, useRef, useState } from 'react'

export const PluginSender = ({
    pluginSource,
    ...propsToPass
}: {
    pluginSource: string
    propsToPass: any
}): JSX.Element => {
    const iframeRef = useRef<any>()

    const [missingProps, setMissingProps] = useState<any[] | null>(null)

    useEffect(() => {
        if (iframeRef?.current) {
            const iframeProps = { ...propsToPass, setMissingProps }
            const listener = postRobot.on(
                'getPropsFromParent',
                // listen for messages coming only from the iframe rendered by this component
                { window: iframeRef.current.contentWindow },
                (): any => {
                    return iframeProps
                }
            )

            return () => listener.cancel()
        }
    }, [propsToPass])

    if (missingProps && missingProps?.length > 0) {
        return (
            <p>{`Plugin could not load because required props are missing: ${missingProps.join()}`}</p>
        )
    }

    return (
        <div>
            {pluginSource ? (
                <iframe
                    ref={iframeRef}
                    src={pluginSource}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    hidden={missingProps === null}
                ></iframe>
            ) : null}
        </div>
    )
}
