import postRobot from 'post-robot'
import { useEffect, useState } from 'react'

export const PluginWrapper = ({
    requiredProps,
    children,
}: {
    requiredProps: [string]
    children: any
}): any => {
    const [propsFromParent, setPropsFromParent] = useState<any>()

    const receivePropsFromParent = (event: any) => {
        const { data: receivedProps } = event
        const { setMissingProps, ...explictlyPassedProps } = receivedProps

        setPropsFromParent(explictlyPassedProps)

        // check for required props
        const missingProps = requiredProps?.filter(
            (prop) => !receivedProps[prop]
        )
        if (missingProps && missingProps.length > 0) {
            setMissingProps(missingProps)
            console.error(
                `The following required props were not provided: ${missingProps.join(
                    ','
                )}`
            )
        } else {
            setMissingProps([])
        }
    }

    useEffect(() => {
        postRobot
            .send(window.top, 'getPropsFromParent')
            .then(receivePropsFromParent)
            .catch((err: Error) => console.error(err))
    })

    return children({ ...propsFromParent })
}
