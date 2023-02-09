import { useDataQuery } from '@dhis2/app-service-data'
import React from 'react'

const meQuery = {
    me: {
        resource: 'me',
        fields: ['authorities'],
    },
}

// plugin error component (e.g. for dealing with missing/inaccessible plugin)

const PluginError = ({
    missingEntryPoint,
    showDownload,
    appShortName,
}: {
    missingEntryPoint: boolean
    showDownload: boolean
    appShortName?: string
}) => {
    const { data }: { data?: any } = useDataQuery(meQuery) // cast to deal with types for now...
    const canAddApp =
        data?.me?.authorities?.includes('ALL') ||
        data?.me?.authorities?.includes('M_dhis-web-app-management')
    return (
        <>
            <p>Plugin unavailable</p>
            {missingEntryPoint ? (
                <>
                    <p>A suitable plugin was not found.</p>
                    {showDownload && canAddApp ? (
                        <p>
                            <a
                                onClick={(e) => e.stopPropagation()}
                                target="_blank"
                                rel="noopener noreferrer"
                                href="/dhis-web-app-management/index.html#/app-hub"
                            >
                                {`Install the ${appShortName}} app from the App Hub`}
                            </a>
                        </p>
                    ) : null}
                </>
            ) : null}
        </>
    )
}

export default PluginError
