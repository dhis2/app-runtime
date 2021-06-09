import { useAlert } from '@dhis2/app-service-alerts'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const OfflineContext = createContext()

export function OfflineInterfaceProvider({
    offlineInterface,
    pwaEnabled: pwaEnabledProp,
    children,
}) {
    const { show } = useAlert(
        ({ message }) => message,
        ({ action, onConfirm }) => ({
            actions: [{ label: action, onClick: onConfirm }],
            permanent: true,
        })
    )

    React.useEffect(() => {
        // TODO: refactor from env var; receive from config
        const pwaEnabled =
            pwaEnabledProp ||
            process.env.REACT_APP_DHIS2_APP_PWA_ENABLED === 'true'
        // init() Returns a cleanup function
        return offlineInterface.init({ promptUpdate: show, pwaEnabled })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <OfflineContext.Provider value={offlineInterface}>
            {children}
        </OfflineContext.Provider>
    )
}

OfflineInterfaceProvider.propTypes = {
    children: PropTypes.node,
    offlineInterface: PropTypes.shape({ init: PropTypes.func }),
    pwaEnabled: PropTypes.bool,
}

export function useOfflineInterface() {
    const offlineInterface = useContext(OfflineContext)

    if (offlineInterface === undefined) {
        throw new Error(
            'useOfflineInterface must be used within an OfflineInterfaceProvider'
        )
    }

    return offlineInterface
}
