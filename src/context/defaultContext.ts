import { ContextType, FetchFunction } from '../types/Context'

const uninitializedFetch: FetchFunction = async path => {
    throw new Error(
        'DHIS2 data context must be initialized, please ensure that you include a <DataProvider> in your application'
    )
}

export const defaultContext: ContextType = {
    baseUrl: '',
    apiVersion: 0,
    apiUrl: '',
    fetch: uninitializedFetch,
}
