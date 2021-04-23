import {
    AnyFunction,
    CacheableSectionOptions,
    OfflineConfig,
    OfflineContextType,
    SubscribableEvent,
} from '../types'
import { CacheableSectionController } from '../utils/CacheableSectionController'
import { EventHandler } from '../utils/EventHandler'

export const makeContext = (config: OfflineConfig): OfflineContextType => {
    const sections = new Map<string, CacheableSectionController>()
    const sectionEventHandler = new EventHandler()
    return {
        ...config,
        subscribe: (event: SubscribableEvent, callback: AnyFunction) => {
            switch (event) {
                case 'addSection':
                case 'removeSection':
                    sectionEventHandler.subscribe(event, callback)
                    return () =>
                        sectionEventHandler.unsubscribe(event, callback)
            }
            return config.subscribe(event, callback)
        },
        addSection: (options: CacheableSectionOptions) => {
            const section = new CacheableSectionController(config, options)
            sections.set(options.id, section)
            sectionEventHandler.trigger('addSection', options)
            return section
        },
        removeSection: (id: string) => {
            sections.delete(id)
            sectionEventHandler.trigger('removeSection', id)
        },
        getSection: (id: string) => {
            return sections.get(id)
        },
    }
}
