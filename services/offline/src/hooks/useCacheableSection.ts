import { useCallback, useContext, useEffect, useState } from 'react'
import { OfflineContext } from '../context/OfflineContext'
import { CacheableSectionOptions, CacheableSectionState } from '../types'

export const useCacheableSection = (id: string) => {
    const config = useContext(OfflineContext)
    const [section, setSection] = useState(config.getSection(id))

    const [state, setState] = useState<CacheableSectionState | undefined>(
        section?.getState()
    )

    useEffect(() => {
        const unsubscribeAddSection = config.subscribe(
            'addSection',
            (options: CacheableSectionOptions) => {
                if (options.id === id) {
                    setSection(config.getSection(id))
                }
            }
        )
        const unsubscribeRemoveSection = config.subscribe(
            'removeSection',
            (removedSectionId: string) => {
                if (removedSectionId === id) {
                    setSection(undefined)
                }
            }
        )

        return () => {
            unsubscribeAddSection()
            unsubscribeRemoveSection()
        }
    }, [config, id])

    useEffect(() => {
        section?.subscribe('stateChanged', setState)
        return () => {
            section?.unsubscribe('stateChanged', setState)
        }
    }, [section])

    const update = useCallback(() => {
        section?.update()
    }, [section])
    const record = useCallback(() => {
        // queue recording
    }, [])

    return {
        initialized: true,
        id,
        ...state,
        update,
        record,
    }
}
