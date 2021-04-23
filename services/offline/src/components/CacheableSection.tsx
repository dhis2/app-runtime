import PropTypes, { string } from 'prop-types'
import type { FC } from 'react'
import React, { useContext, useEffect, useState } from 'react'
import { OfflineContext } from '../context/OfflineContext'
import { CacheableSectionOptions } from '../types'

type RenderMode = 'PENDING' | 'RECORDING_PENDING' | 'RECORDING' | 'DEFAULT'

export const CacheableSection: FC<{
    children: React.ReactNode
    options: CacheableSectionOptions
}> = ({ children, options }) => {
    const context = useContext(OfflineContext)
    const [renderMode, setRenderMode] = useState<RenderMode>('PENDING')

    useEffect(() => {
        const section = context.addSection(options)

        if (section.getState().lastUpdated) {
            setRenderMode('DEFAULT')
        }

        const onRecordingStart = () => {
            setRenderMode('RECORDING_PENDING')
        }

        section.subscribe('recordingStart', onRecordingStart)

        return () => {
            section.unsubscribe('recordingStart', onRecordingStart)
            context.removeSection(options.id)
        }
    }, [context, options])

    useEffect(() => {
        const section = context.getSection(options.id)

        if (renderMode === 'RECORDING_PENDING') {
            section?.startRecording().then(() => {
                setRenderMode('RECORDING')
            })
        } else if (renderMode === 'RECORDING') {
            section?.stopRecording().then(() => {
                setRenderMode('DEFAULT')
            })
        }
    }, [renderMode]) /* eslint-disable-line react-hooks/exhaustive-deps */

    switch (renderMode) {
        case 'PENDING':
        case 'RECORDING_PENDING':
            return null
        case 'RECORDING':
        case 'DEFAULT':
            return <>{children}</>
    }
}

CacheableSection.propTypes = {
    options: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,
}
