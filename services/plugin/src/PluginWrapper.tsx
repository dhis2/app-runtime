import postRobot from 'post-robot'
import { useCallback, useEffect, useState } from 'react'
import { usePluginContext } from './PluginContext'

export const PluginWrapper = ({
    requiredProps,
    children,
}: {
    requiredProps: [string]
    children: any
}): any => {
    const {
        setOnPluginError,
        setClearPluginError,
        setParentAlertsAdd,
        setShowAlertsInPlugin,
    } = usePluginContext()
    const [propsFromParent, setPropsFromParent] = useState<any>()
    const [propsThatAreMissing, setPropsThatAreMissing] = useState<
        Array<string>
    >([])

    const receivePropsFromParent = useCallback(
        (event: any): void => {
            const { data: receivedProps } = event
            const {
                setInErrorState,
                setCommunicationReceived,
                alertsAdd,
                showAlertsInPlugin,
                onError,
                ...explicitlyPassedProps
            } = receivedProps

            setPropsFromParent(explicitlyPassedProps)

            // check for required props
            const missingProps = requiredProps?.filter(
                (prop) => !explicitlyPassedProps[prop]
            )

            // if there are missing props, set to state to throw error
            if (missingProps && missingProps.length > 0) {
                console.error(`These props are missing: ${missingProps.join()}`)
                setPropsThatAreMissing(missingProps)
            }

            if (setOnPluginError && setInErrorState) {
                if (onError) {
                    setOnPluginError(() => (error: Error) => {
                        setCommunicationReceived(false)
                        setInErrorState(true)
                        onError(error)
                    })
                } else {
                    setOnPluginError(() => () => {
                        setCommunicationReceived(false)
                        setInErrorState(true)
                    })
                }
            }

            if (setClearPluginError && setInErrorState) {
                setClearPluginError(() => () => {
                    setInErrorState(false)
                })
            }

            if (setParentAlertsAdd && alertsAdd) {
                setParentAlertsAdd(() => (alert: any, alertRef: any) => {
                    alertsAdd(alert, alertRef)
                })
            }

            if (showAlertsInPlugin && setShowAlertsInPlugin) {
                setShowAlertsInPlugin(Boolean(showAlertsInPlugin))
            }
        },
        [
            requiredProps,
            setOnPluginError,
            setClearPluginError,
            setParentAlertsAdd,
            setShowAlertsInPlugin,
        ]
    )

    useEffect(() => {
        if (setOnPluginError) {
            // make first request for props to communicate that iframe is ready
            postRobot
                .send(window.top, 'getPropsFromParent')
                .then(receivePropsFromParent)
                .catch((err: Error) => {
                    console.error(err)
                })
        }
    }, [receivePropsFromParent, setOnPluginError])

    useEffect(() => {
        // set up listener to listen for subsequent sends from parent window
        const listener = postRobot.on(
            'updated',
            { window: window.top },
            (event): any => {
                receivePropsFromParent(event)
            }
        )

        return () => listener.cancel()
    }, [receivePropsFromParent])

    // throw error if props are missing
    useEffect(() => {
        if (propsThatAreMissing.length > 0) {
            throw new Error(
                `These props are missing: ${propsThatAreMissing.join()}`
            )
        }
    }, [propsThatAreMissing])

    return children({ ...propsFromParent })
}
