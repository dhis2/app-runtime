export {
    CustomDataProvider,
    DataProvider,
    DataQuery,
    DataMutation,
    FetchError,
    useDataQuery,
    useDataMutation,
    useDataEngine,
} from '@dhis2/app-service-data'

export { useConfig, useTimeZoneConversion } from '@dhis2/app-service-config'

export { useAlerts, useAlert } from '@dhis2/app-service-alerts'

export {
    useOnlineStatus,
    useDhis2ConnectionStatus,
    useOnlineStatusMessage,
    useSetOnlineStatusMessage,
    useOnlineStatusMessageValue,
    useCacheableSection,
    CacheableSection,
    useCachedSections,
    clearSensitiveCaches,
} from '@dhis2/app-service-offline'

export { Provider } from './Provider'

import type { Config } from './d2config.types'

export declare type D2Config = Config
