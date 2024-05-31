import React from 'react'

// PLACEHOLDER plugin error component (e.g. for dealing with missing/inaccessible plugin)
// note that d2-i18n does not work with typescript projects, so we cannot currently translate

const PluginError = ({
    missingEntryPoint,
    appShortName,
}: {
    missingEntryPoint: boolean
    appShortName?: string
}) => (
    <>
        <p>Plugin unavailable</p>
        {missingEntryPoint ? (
            <>
                <p>{`You do not have access to the requested plugin ${appShortName}, or it is not installed`}</p>
            </>
        ) : null}
    </>
)

export default PluginError
