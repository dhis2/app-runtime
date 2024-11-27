import { renderHook } from '@testing-library/react'
import React, { FC } from 'react'
import { mockOfflineInterface } from '../../utils/test-mocks'
import { useCachedSection, useRecordingState } from '../cacheable-section-state'
import { OfflineProvider } from '../offline-provider'

const wrapper: FC = ({ children }) => (
    <OfflineProvider offlineInterface={mockOfflineInterface}>
        {children}
    </OfflineProvider>
)

test('useRecordingState has stable references', () => {
    const { result, rerender } = renderHook(() => useRecordingState('one'), {
        wrapper,
    })

    const origRecordingState = result.current.recordingState
    const origSetRecordingState = result.current.setRecordingState
    const origRemoveRecordingState = result.current.removeRecordingState

    rerender()

    expect(result.current.recordingState).toBe(origRecordingState)
    expect(result.current.setRecordingState).toBe(origSetRecordingState)
    expect(result.current.removeRecordingState).toBe(origRemoveRecordingState)
})

test('useCachedSection has stable references', () => {
    const { result, rerender } = renderHook(() => useCachedSection('one'), {
        wrapper,
    })

    const origIsCached = result.current.isCached
    const origLastUpdated = result.current.lastUpdated
    const origRemove = result.current.remove
    const origSyncCachedSections = result.current.syncCachedSections

    rerender()

    expect(result.current.isCached).toBe(origIsCached)
    expect(result.current.lastUpdated).toBe(origLastUpdated)
    expect(result.current.remove).toBe(origRemove)
    expect(result.current.syncCachedSections).toBe(origSyncCachedSections)
})
