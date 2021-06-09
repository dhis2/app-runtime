import { useAlert } from '@dhis2/app-service-alerts'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const OfflineContext = createContext()

export function OfflineInterfaceProvider({
    offlineInterface,
    pwaEnabled,
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
