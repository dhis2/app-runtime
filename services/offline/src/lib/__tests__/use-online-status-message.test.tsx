import { renderHook, act } from '@testing-library/react'
import React, { FC } from 'react'
import { mockOfflineInterface } from '../../utils/test-mocks'
import { OfflineProvider } from '../offline-provider'
import { useOnlineStatusMessage } from '../online-status-message'

describe('useOnlineStatusMessage', () => {
    it('should allow the online status to be updated ', () => {
        const wrapper: FC = ({ children }) => (
            <OfflineProvider offlineInterface={mockOfflineInterface}>
                {children}
            </OfflineProvider>
        )

        const { result } = renderHook(() => useOnlineStatusMessage(), {
            wrapper,
        })

        expect(result.current.onlineStatusMessage).toBeUndefined()

        act(() => {
            result.current.setOnlineStatusMessage('8 offline events')
        })

        expect(result.current.onlineStatusMessage).toEqual('8 offline events')
    })
})
